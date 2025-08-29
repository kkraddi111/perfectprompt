import { GoogleGenAI, Type, GenerateContentParameters } from "@google/genai";
import type { EnhancedPromptResponse, Suggestion } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Using a placeholder. Functionality will be limited.");
  process.env.API_KEY = "MISSING_API_KEY";
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Internal helper to centralize API calls, error handling, and JSON parsing
// FIX: Use GenerateContentParameters instead of the deprecated GenerateContentRequest.
const _handleApiCall = async <T>(request: GenerateContentParameters, caller: string): Promise<T> => {
    if (process.env.API_KEY === "MISSING_API_KEY") {
        throw new Error("Gemini API key is not configured.");
    }
    try {
        const result = await ai.models.generateContent(request);
        const jsonString = result.text.trim();
        return JSON.parse(jsonString) as T;
    } catch (error) {
        console.error(`Error in ${caller}:`, error);
        throw new Error(`Failed to ${caller.toLowerCase()}: ${error instanceof Error ? error.message : 'Unknown API error'}`);
    }
};

const suggestionsSchema = {
    type: Type.OBJECT,
    properties: {
        suggestions: {
            type: Type.ARRAY,
            description: "A list of 3-5 high-impact, actionable suggestions to improve the prompt.",
            items: {
                type: Type.OBJECT,
                properties: {
                    technique: {
                        type: Type.STRING,
                        description: "The name of the prompting technique used. Must be one of: Role Prompting, Add Context, Few-Shot Prompting, Add Constraints, Specify Format, Chain-of-Thought."
                    },
                    suggestion: {
                        type: Type.STRING,
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
    type: Type.OBJECT,
    properties: {
        enhancedPrompt: {
            type: Type.STRING,
            description: "The improved, enhanced prompt, rewritten to be more effective based on the requested changes."
        },
        changes: {
            type: Type.ARRAY,
            description: "A list of the actionable changes that were made to generate the enhanced prompt, derived from the user's selections.",
            items: { type: Type.STRING }
        }
    },
    required: ['enhancedPrompt', 'changes']
};

const getModelSpecificInstructions = (model: string): string => {
    switch (model) {
        case 'GPT-4o':
            return `Pay special attention to structuring the prompt with clear headings (e.g., ## Context, ## Task) and step-by-step instructions, as this works well for GPT-4o.`;
        case 'Claude 3 Sonnet':
            return `Enclose key instructions, examples, or context within XML tags (e.g., <instructions></instructions>, <example></example>), as this is a known best practice for Claude 3 models.`;
        case 'Cursor':
            return `For Cursor, an AI code editor, suggestions should be action-oriented for code generation or modification. Think about specifying file context, language, and exact changes needed.`;
        case 'Lovable':
            return `For Lovable, a user research AI, suggestions should focus on tasks like generating user interview questions, summarizing feedback, or creating user personas.`;
        case 'Bolt':
            return `For Bolt, an AI tool for search and content creation, suggestions should optimize for clarity, conciseness, and specifying output formats (e.g., 'as a bulleted list').`;
        case 'Default (Gemini)':
        default:
            return '';
    }
};

export const getEnhancementSuggestions = async (originalPrompt: string, category: string, model: string): Promise<Suggestion[]> => {
    const modelInstructions = getModelSpecificInstructions(model);
    const request = {
        model: "gemini-2.5-flash",
        contents: `You are an expert prompt engineer. Your task is to analyze the following user prompt and suggest improvements. Return a JSON object with a "suggestions" key, which contains a list of 3-5 objects. Each object must have two keys: "technique" and "suggestion".

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

Return ONLY the raw JSON object.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: suggestionsSchema,
            temperature: 0.5,
        }
    };
    
    const response = await _handleApiCall<{ suggestions: Suggestion[] }>(request, "get suggestions");
    if (!Array.isArray(response.suggestions)) {
        throw new Error("Invalid JSON structure received for suggestions.");
    }
    return response.suggestions;
};

export const applyEnhancements = async (originalPrompt: string, changesToApply: string[], category: string, model: string): Promise<EnhancedPromptResponse> => {
    const modelInstructions = getModelSpecificInstructions(model);
    const request = {
        model: "gemini-2.5-flash",
        contents: `You are an expert prompt engineer. Your task is to rewrite a user's prompt by applying a specific list of improvements.

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

Return ONLY the raw JSON object.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: enhancementSchema,
            temperature: 0.4,
        }
    };

    const response = await _handleApiCall<EnhancedPromptResponse>(request, "apply enhancements");
    if (!response.enhancedPrompt || !Array.isArray(response.changes)) {
        throw new Error("Invalid JSON structure received from API.");
    }
    return response;
};

export const generateTestResponse = async (prompt: string): Promise<string> => {
    if (process.env.API_KEY === "MISSING_API_KEY") {
        return Promise.reject(new Error("Gemini API key is not configured."));
    }
    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.7,
            }
        });
        return result.text;
    } catch (error) {
        console.error("Error generating test response:", error);
         if (error instanceof Error) {
            throw new Error(`Failed to generate response: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the response.");
    }
};