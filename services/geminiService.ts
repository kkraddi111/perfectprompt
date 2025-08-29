import { GoogleGenAI, Type } from "@google/genai";
import type { EnhancedPromptResponse } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Using a placeholder. Functionality will be limited.");
  process.env.API_KEY = "MISSING_API_KEY";
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        enhancedPrompt: {
            type: Type.STRING,
            description: "The improved, enhanced prompt."
        },
        changes: {
            type: Type.ARRAY,
            description: "A list of concise descriptions of the changes made to the original prompt.",
            items: {
                type: Type.STRING
            }
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
            return `Cursor is an AI code editor. Prompts should be action-oriented for code generation or modification. Advise the AI to be explicit about file context, language, and the exact changes needed. Using diff formats or specifying function signatures can be effective.`;
        case 'Lovable':
            return `Lovable is a user research AI. Prompts should focus on tasks like generating user interview questions, summarizing feedback, or creating user personas. Instruct the AI to maintain a neutral, inquisitive tone and to structure outputs clearly for analysis.`;
        case 'Bolt':
            return `Bolt is an AI tool for search and content creation. Optimize prompts for clarity and conciseness. Suggest specifying the desired output format (e.g., 'as a bulleted list', 'in a markdown table') and the target audience for the content.`;
        case 'Default (Gemini)':
        default:
            return '';
    }
}

export const enhancePrompt = async (originalPrompt: string, category: string, model: string): Promise<EnhancedPromptResponse> => {
    if (process.env.API_KEY === "MISSING_API_KEY") {
        return Promise.reject(new Error("Gemini API key is not configured. Please set the API_KEY environment variable."));
    }

    const modelInstructions = getModelSpecificInstructions(model);

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are an expert prompt engineer. Your task is to enhance the following user-provided prompt.

Target Model: ${model}
Category: "${category}"

Original Prompt:
---
${originalPrompt}
---

Apply proven prompt engineering techniques where appropriate, such as:
- **Context Addition:** Add relevant background information.
- **Format Specification:** Specify the desired output format (e.g., JSON, markdown, list).
- **Role Assignment:** Assign a persona or role to the AI (e.g., "Act as a senior software engineer...").
- **Clarity Improvement:** Rephrase for precision and remove ambiguity.
- **Constraint Setting:** Add constraints like word count, tone, or what to avoid.
- **Exemplars:** Provide few-shot examples if it helps.

${modelInstructions ? `**Model-Specific Optimizations:**\n${modelInstructions}\n` : ''}
Return ONLY the raw JSON object, without any markdown formatting like \`\`\`json.
`,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.5,
            }
        });

        const jsonString = result.text.trim();
        const parsedResponse: EnhancedPromptResponse = JSON.parse(jsonString);
        
        if (!parsedResponse.enhancedPrompt || !Array.isArray(parsedResponse.changes)) {
            throw new Error("Invalid JSON structure received from API.");
        }

        return parsedResponse;
    } catch (error) {
        console.error("Error enhancing prompt:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to enhance prompt: ${error.message}`);
        }
        throw new Error("An unknown error occurred while enhancing the prompt.");
    }
};

export const generateTestResponse = async (prompt: string): Promise<string> => {
    if (process.env.API_KEY === "MISSING_API_KEY") {
        return Promise.reject(new Error("Gemini API key is not configured. Please set the API_KEY environment variable."));
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