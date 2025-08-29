import React, { useState, useEffect } from 'react';
import { PROMPT_CATEGORIES, SUPPORTED_MODELS } from '../constants';
import { enhancePrompt, generateTestResponse } from '../services/geminiService';
import type { EnhancedPromptResponse } from '../types';
import ComparisonView from './ComparisonView';
import SandboxResult from './SandboxResult';
import SparklesIcon from './icons/SparklesIcon';

interface PromptEditorProps {
    onNewEnhancedPrompt: (originalPrompt: string, category: string, model: string, response: EnhancedPromptResponse) => void;
    activePrompt: { originalPrompt: string; category: string; model?: string; } | null;
    enhancedResult: EnhancedPromptResponse | null;
    onClear: () => void;
}

const PromptEditor: React.FC<PromptEditorProps> = ({ onNewEnhancedPrompt, activePrompt, enhancedResult, onClear }) => {
    const [prompt, setPrompt] = useState('');
    const [category, setCategory] = useState(PROMPT_CATEGORIES[0]);
    const [model, setModel] = useState(SUPPORTED_MODELS[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // State for the Sandbox feature
    const [isSandboxLoading, setIsSandboxLoading] = useState(false);
    const [sandboxResult, setSandboxResult] = useState<string | null>(null);
    const [sandboxError, setSandboxError] = useState<string | null>(null);

    useEffect(() => {
        if (activePrompt) {
            setPrompt(activePrompt.originalPrompt);
            setCategory(activePrompt.category);
            setModel(activePrompt.model || SUPPORTED_MODELS[0]);
        } else {
            setPrompt('');
            setCategory(PROMPT_CATEGORIES[0]);
            setModel(SUPPORTED_MODELS[0]);
        }
    }, [activePrompt]);

    // Clear sandbox when the main prompt is cleared
    useEffect(() => {
        if (!enhancedResult) {
            setSandboxResult(null);
            setSandboxError(null);
            setIsSandboxLoading(false);
        }
    }, [enhancedResult]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        // Clear previous sandbox result on new enhancement
        setSandboxResult(null);
        setSandboxError(null);
        try {
            const response = await enhancePrompt(prompt, category, model);
            onNewEnhancedPrompt(prompt, category, model, response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTestPrompt = async () => {
        if (!enhancedResult?.enhancedPrompt || isSandboxLoading) return;
        
        setIsSandboxLoading(true);
        setSandboxResult(null);
        setSandboxError(null);
        try {
            const response = await generateTestResponse(enhancedResult.enhancedPrompt);
            setSandboxResult(response);
        } catch (err) {
            setSandboxError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        } finally {
            setIsSandboxLoading(false);
        }
    };
    
    const charCount = prompt.length;
    const maxChars = 2000;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Prompt Enhancer</h2>
                 {enhancedResult && (
                    <button
                        onClick={onClear}
                        className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                    >
                        Start New
                    </button>
                 )}
            </div>
            
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="prompt-category" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                            Category
                        </label>
                        <select
                            id="prompt-category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2.5 focus:ring-primary-500 focus:border-primary-500"
                            disabled={isLoading}
                        >
                            {PROMPT_CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="target-model" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                            Target Model
                        </label>
                        <select
                            id="target-model"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2.5 focus:ring-primary-500 focus:border-primary-500"
                            disabled={isLoading}
                        >
                            {SUPPORTED_MODELS.map(mod => (
                                <option key={mod} value={mod}>{mod}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="prompt-input" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                        Your Prompt
                    </label>
                    <div className="relative">
                        <textarea
                            id="prompt-input"
                            rows={8}
                            maxLength={maxChars}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-3 focus:ring-primary-500 focus:border-primary-500 resize-y font-mono text-sm"
                            placeholder="e.g., write a poem about the moon"
                            disabled={isLoading}
                        />
                         <div className={`absolute bottom-2 right-2 text-xs ${charCount > maxChars * 0.9 ? 'text-red-500' : 'text-slate-400'}`}>
                            {charCount} / {maxChars}
                        </div>
                    </div>
                </div>

                {error && <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-md relative mb-4 text-sm" role="alert">{error}</div>}
                
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading || !prompt.trim()}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all"
                    >
                        {isLoading ? (
                            <>
                               <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Enhancing...
                            </>
                        ) : (
                            <>
                                <SparklesIcon className="-ml-1 mr-2 h-5 w-5" />
                                Enhance Prompt
                            </>
                        )}
                    </button>
                </div>
            </form>
            
            {enhancedResult && activePrompt && (
                <ComparisonView 
                    originalPrompt={activePrompt.originalPrompt}
                    enhancedPrompt={enhancedResult.enhancedPrompt}
                    changes={enhancedResult.changes}
                    onTest={handleTestPrompt}
                    isTesting={isSandboxLoading}
                />
            )}

            {(isSandboxLoading || sandboxResult || sandboxError) && (
                 <SandboxResult
                    isLoading={isSandboxLoading}
                    result={sandboxResult}
                    error={sandboxError}
                    onClose={() => {
                        setSandboxResult(null);
                        setSandboxError(null);
                    }}
                 />
            )}
        </div>
    );
};

export default PromptEditor;