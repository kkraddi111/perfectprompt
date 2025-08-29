export interface PromptHistoryItem {
  id: string;
  originalPrompt: string;
  enhancedPrompt: string;
  category: string;
  changes: string[];
  timestamp: number;
}

export interface EnhancedPromptResponse {
    enhancedPrompt: string;
    changes: string[];
}
