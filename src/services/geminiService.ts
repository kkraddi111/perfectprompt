import { GoogleGenerativeAI } from "@google/generative-ai";
import type { EnhancedPromptResponse, Suggestion } from '../types';

let ai: GoogleGenerativeAI | null = null;

export function initializeGeminiClient(apiKey: string | null) {
    if (apiKey) {
        try {
            ai = new GoogleGenerativeAI(apiKey);
        } catch (error) {
            console.error("Failed to initialize GoogleGenAI:", error);
            ai = null;
        }
    } else {
        ai = null;
    }
}

const MISSING_KEY_ERROR = "Gemini API key is not configured. Please add it in the Settings menu (⚙️).";

/**
 * A generic API handler for requests that return a JSON string.
 * It handles the API call, error logging, and JSON parsing.
 * @private
 */
const _handleJsonApiCall = async <T>(prompt: string, generationConfig: any, caller: string): Promise<T> => {
    if (!ai) throw new Error(MISSING_KEY_ERROR);

    try {
        const model = ai.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (typeof text !== 'string' || !text.trim()) {
            throw new Error("API returned empty or invalid response.");
        }
        const jsonString = text.trim();
        if (!jsonString.startsWith('{') && !jsonString.startsWith('[')) {
            throw new Error("API did not return a valid JSON object.");
        }
        return JSON.parse(jsonString) as T;
    } catch (error) {
        console.error(`Error in ${caller}:`, error);
        throw new Error(`Failed to ${caller.toLowerCase()}: ${error instanceof Error ? error.message : 'Unknown API error'}`);
    }
};

/**
 * A generic API handler for requests that return a raw text string.
 * It handles the API call and error logging.
 * @private
 */
const _handleTextApiCall = async (prompt: string, generationConfig: any, caller: string): Promise<string> => {
    if (!ai) throw new Error(MISSING_KEY_ERROR);

    try {
        const model = ai.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (typeof text !== 'string' || !text.trim()) {
            throw new Error("API returned empty or invalid response.");
        }
        return text;
    } catch (error) {
        console.error(`Error in ${caller}:`, error);
        if (error instanceof Error) {
            throw new Error(`Failed to ${caller.toLowerCase()}: ${error.message}`);
        }
        throw new Error(`An unknown error occurred while trying to ${caller.toLowerCase()}.`);
    }
}


const suggestionsSchema = {
    type: "object",
    properties: {
        suggestions: {
            type: "array",
            description: "A list of 3-5 high-impact, actionable suggestions to improve the prompt.",
            items: {
                type: "object",
                properties: {
                    technique: {
                        type: "string",
                        description: "The name of the prompting technique used. Must be one of: Role Prompting, Add Context, Few-Shot Prompting, Add Constraints, Specify Format, Chain-of-Thought."
                    },
                    suggestion: {
                        type: "string",
                        description: "The concise, actionable suggestion to improve the prompt."
                    }
                },
                required: ['technique', 'suggestion']
            }
        }
    },
    required: ['suggestions']
};

const enhancementSchema = {
    type: "object",
    properties: {
        enhancedPrompt: {
            type: "string",
            description: "The improved, enhanced prompt, rewritten to be more effective based on the requested changes."
        },
        changes: {
            type: "array",
            description: "A list of the actionable changes that were made to generate the enhanced prompt, derived from the user's selections.",
            items: { type: "string" }
        }
    },
    required: ['enhancedPrompt', 'changes']
};

const MODEL_INSTRUCTIONS_MAP: Record<string, string> = {
    'GPT-4o': `Pay special attention to structuring the prompt with clear headings (e.g., ## Context, ## Task) and step-by-step instructions, as this works well for GPT-4o.`,
    'Claude 3 Sonnet': `Enclose key instructions, examples, or context within XML tags (e.g., <instructions></instructions>, <example></example>), as this is a known best practice for Claude 3 models.`,
    'Cursor': `For Cursor, an AI code editor, suggestions should be action-oriented for code generation or modification. Think about specifying file context, language, and exact changes needed.`,
    'Lovable': `For Lovable, a user research AI, suggestions should focus on tasks like generating user interview questions, summarizing feedback, or creating user personas.`,
    'Bolt': `For Bolt, an AI tool for search and content creation, suggestions should optimize for clarity, conciseness, and specifying output formats (e.g., 'as a bulleted list').`
};

const getModelSpecificInstructions = (model: string): string => {
    return MODEL_INSTRUCTIONS_MAP[model] || '';
};

const createGenerationConfig = (responseSchema: object, temperature: number) => ({
    responseMimeType: "application/json",
    responseSchema,
    temperature,
});

export const getEnhancementSuggestions = async (originalPrompt: string, category: string, model: string): Promise<Suggestion[]> => {
    const modelInstructions = getModelSpecificInstructions(model);
    const contents = `You are an expert prompt engineer. Your task is to analyze the following user prompt and suggest improvements. Return a JSON object with a "suggestions" key, which contains a list of 3-5 objects. Each object must have two keys: "technique" and "suggestion".

**Prompting Techniques to use:**
- Role Prompting
- Add Context
- Few-Shot Prompting
- Add Constraints
- Specify Format
- Chain-of-Thought

Target Model: ${model}
Category: "${category}"
${modelInstructions ? `**Model-Specific Considerations:**\n${modelInstructions}\n` : ''}

Original Prompt:
---
${originalPrompt}
---

Focus on proven techniques. Each suggestion must be concise and actionable.

Return ONLY the raw JSON object.`;

    const generationConfig = createGenerationConfig(suggestionsSchema, 0.5);
    const response = await _handleJsonApiCall<{ suggestions: Suggestion[] }>(contents, generationConfig, "get suggestions");

    if (!Array.isArray(response.suggestions)) {
        throw new Error("Invalid JSON structure received for suggestions.");
    }
    return response.suggestions;
};

export const applyEnhancements = async (originalPrompt: string, changesToApply: string[], category: string, model: string): Promise<EnhancedPromptResponse> => {
    const modelInstructions = getModelSpecificInstructions(model);
    const contents = `You are an expert prompt engineer. Your task is to rewrite a user's prompt by applying a specific list of improvements.

Return a JSON object containing two keys:
1. "changes": A list of the improvements you applied. This should be very similar to the requested changes.
2. "enhancedPrompt": The final, rewritten prompt.

Target Model: ${model}
Category: "${category}"
${modelInstructions ? `**Model-Specific Optimizations:**\n${modelInstructions}\n` : ''}

Original Prompt:
---
${originalPrompt}
---

Apply these exact changes:
- ${changesToApply.join('\n- ')}

Return ONLY the raw JSON object.`;

    const generationConfig = createGenerationConfig(enhancementSchema, 0.4);
    const response = await _handleJsonApiCall<EnhancedPromptResponse>(contents, generationConfig, "apply enhancements");

    if (!response.enhancedPrompt || !Array.isArray(response.changes)) {
        throw new Error("Invalid JSON structure received from API.");
    }
    return response;
};

export const generateTestResponse = async (prompt: string): Promise<string> => {
    const generationConfig = { temperature: 0.7 };
    return _handleTextApiCall(prompt, generationConfig, "generate test response");
};
