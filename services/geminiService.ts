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

export const enhancePrompt = async (originalPrompt: string, category: string): Promise<EnhancedPromptResponse> => {
    if (process.env.API_KEY === "MISSING_API_KEY") {
        return Promise.reject(new Error("Gemini API key is not configured. Please set the API_KEY environment variable."));
    }
    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are an expert prompt engineer. Enhance the following prompt for the category: "${category}".

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
