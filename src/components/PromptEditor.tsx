import React, { useState, useEffect } from 'react';
import { PROMPT_CATEGORIES, SUPPORTED_MODELS } from '@/constants';
import { getEnhancementSuggestions, applyEnhancements } from '@/services/geminiService';
import type { EnhancedPromptResponse, Suggestion } from '@/types';

import Card from '@/components/ui/Card';
import PromptForm from '@/components/PromptForm';
import SuggestionsView from '@/components/SuggestionsView';
import PromptResultView from '@/components/PromptResultView';

interface PromptEditorProps {
    onNewEnhancedPrompt: (originalPrompt: string, category: string, model: string, response: EnhancedPromptResponse) => void;
    activePrompt: { originalPrompt: string; category: string; model?: string; } | null;
    enhancedResult: EnhancedPromptResponse | null;
    onClear: () => void;
}

// This component manages the main user workflow as a state machine:
// 'form': The user is editing their initial prompt.
// 'suggesting': Loading state while waiting for suggestions from the AI.
// 'reviewing': The user is reviewing the AI-generated suggestions and can select which ones to apply.
// 'applying': Loading state while the AI applies the selected changes to generate the final prompt.
// The final result is then passed up to the App component, which causes this component to re-render and display the PromptResultView.
type EnhancementStep = 'form' | 'suggesting' | 'reviewing' | 'applying';

const PromptEditor: React.FC<PromptEditorProps> = ({ onNewEnhancedPrompt, activePrompt, enhancedResult, onClear }) => {
    const [prompt, setPrompt] = useState('');
    const [category, setCategory] = useState(PROMPT_CATEGORIES[0]);
    const [model, setModel] = useState(SUPPORTED_MODELS[0]);
    const [error, setError] = useState<string | null>(null);
    const [enhancementStep, setEnhancementStep] = useState<EnhancementStep>('form');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [selectedChanges, setSelectedChanges] = useState<string[]>([]);

    useEffect(() => {
        // This effect synchronizes the editor's state with the main app state (activePrompt).
        // It populates the form when a history item/template is loaded, and clears it when starting new.
        if (activePrompt) {
            setPrompt(activePrompt.originalPrompt);
            setCategory(activePrompt.category);
            setModel(activePrompt.model || SUPPORTED_MODELS[0]);
        } else {
            setPrompt('');
            setCategory(PROMPT_CATEGORIES[0]);
            setModel(SUPPORTED_MODELS[0]);
        }
        
        // This block resets the enhancement workflow (suggestions, review step, etc.)
        // whenever there isn't a final result being displayed (e.g., when starting new or selecting a template).
        if (!enhancedResult) {
            setError(null);
            setEnhancementStep('form');
            setSuggestions([]);
            setSelectedChanges([]);
        }
    }, [activePrompt, enhancedResult]);

    const handleGetSuggestions = async (currentPrompt: string, currentCategory: string, currentModel: string) => {
        if (!currentPrompt.trim() || enhancementStep !== 'form') return;
        
        setPrompt(currentPrompt);
        setCategory(currentCategory);
        setModel(currentModel);

        setEnhancementStep('suggesting');
        setError(null);
        try {
            const suggestionsResult = await getEnhancementSuggestions(currentPrompt, currentCategory, currentModel);
            setSuggestions(suggestionsResult);
            setSelectedChanges(suggestionsResult.map(s => s.suggestion));
            setEnhancementStep('reviewing');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
            setEnhancementStep('form');
        }
    };

    const handleApplyChanges = async () => {
        if (selectedChanges.length === 0 || enhancementStep !== 'reviewing') return;
        
        setEnhancementStep('applying');
        setError(null);
        try {
            const response = await applyEnhancements(prompt, selectedChanges, category, model);
            onNewEnhancedPrompt(prompt, category, model, response);
            // App component will update props, which will reset the editor's view via useEffect.
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred while applying changes.');
            setEnhancementStep('reviewing'); // Go back to review on failure
        }
    };

    const handleSelectionChange = (change: string, isSelected: boolean) => {
        setSelectedChanges(prev => isSelected ? [...prev, change] : prev.filter(c => c !== change));
    };

    const isLoading = enhancementStep === 'suggesting' || enhancementStep === 'applying';
    const isReviewing = enhancementStep === 'reviewing';
    const showStartNewButton = enhancedResult || isReviewing || isLoading;

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Prompt Enhancer</h2>
                 {showStartNewButton && (
                    <button
                        onClick={onClear}
                        className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                    >
                        Start New
                    </button>
                 )}
            </div>

            {error && <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-md relative my-4 text-sm animate-fade-in" role="alert">{error}</div>}
            
            {enhancedResult && activePrompt ? (
                <PromptResultView 
                    originalPrompt={activePrompt.originalPrompt}
                    enhancedResult={enhancedResult}
                />
            ) : (
                <>
                    <PromptForm 
                        initialPrompt={prompt}
                        initialCategory={category}
                        initialModel={model}
                        onSubmit={handleGetSuggestions}
                        isLoading={enhancementStep === 'suggesting'}
                        isEditingDisabled={isReviewing || isLoading}
                    />
                    {(enhancementStep === 'reviewing' || enhancementStep === 'applying') && (
                        <SuggestionsView 
                            suggestions={suggestions}
                            selectedChanges={selectedChanges}
                            onSelectionChange={handleSelectionChange}
                            onApply={handleApplyChanges}
                            onCancel={() => setEnhancementStep('form')}
                            isApplying={enhancementStep === 'applying'}
                        />
                    )}
                </>
            )}
        </Card>
    );
};

export default PromptEditor;
