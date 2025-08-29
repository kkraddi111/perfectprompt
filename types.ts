export interface PromptHistoryItem {
  id: string;
  originalPrompt: string;
  enhancedPrompt: string;
  category: string;
  changes: string[];
  timestamp: number;
  model?: string;
}

export interface EnhancedPromptResponse {
    enhancedPrompt: string;
    changes: string[];
}

export interface PromptTemplate {
  title: string;
  description: string;
  prompt: string;
}

export interface PromptTemplateCategory {
  category: string;
  templates: PromptTemplate[];
}