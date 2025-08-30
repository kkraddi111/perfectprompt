// Alternative fix - add this interface at the top of your file
interface GenerateContentResult {
  text?: string;
  response?: {
    text(): string;
  };
}

// Then modify your functions like this:
const _handleJsonApiCall = async <T>(request: GenerateContentParameters, caller: string): Promise<T> => {
    if (!ai) throw new Error(MISSING_KEY_ERROR);
    
    try {
        const result = await ai.models.generateContent(request) as GenerateContentResult;
        let responseText: string = '';
        
        if (result.text) {
            responseText = result.text;
        } else if (result.response?.text) {
            responseText = result.response.text();
        } else {
            throw new Error("API returned no text content.");
        }
        
        const jsonString = responseText.trim();
        
        if (!jsonString) {
            throw new Error("API returned empty response.");
        }
        
        if (!jsonString.startsWith('{') && !jsonString.startsWith('[')) {
            throw new Error("API did not return a valid JSON object.");
        }
        return JSON.parse(jsonString) as T;
    } catch (error) {
        console.error(`Error in ${caller}:`, error);
        throw new Error(`Failed to ${caller.toLowerCase()}: ${error instanceof Error ? error.message : 'Unknown API error'}`);
    }
};

const _handleTextApiCall = async (request: GenerateContentParameters, caller: string): Promise<string> => {
    if (!ai) throw new Error(MISSING_KEY_ERROR);

    try {
        const result = await ai.models.generateContent(request) as GenerateContentResult;
        let responseText: string = '';
        
        if (result.text) {
            responseText = result.text;
        } else if (result.response?.text) {
            responseText = result.response.text();
        } else {
            throw new Error("API returned no text content.");
        }
        
        return responseText;
    } catch (error) {
        console.error(`Error in ${caller}:`, error);
        if (error instanceof Error) {
            throw new Error(`Failed to ${caller.toLowerCase()}: ${error.message}`);
        }
        throw new Error(`An unknown error occurred while trying to ${caller.toLowerCase()}.`);
    }
}
