import React, { useState, useEffect } from 'react';
import { PROMPT_CATEGORIES, SUPPORTED_MODELS } from '../constants';
import { getEnhancementSuggestions, applyEnhancements, generateTestResponse } from '../services/geminiService';
import type { EnhancedPromptResponse } from '../types';
import SuggestionsView from './SuggestionsView';
import SandboxResult from './SandboxResult';
import SparklesIcon from './icons/SparklesIcon';
import ClipboardIcon from './icons/ClipboardIcon';
import PlayIcon from './icons/PlayIcon';

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
    const [error, setError] = useState<string | null>(null);

    // State for enhancement workflow
    type EnhancementStep = 'form' | 'suggesting' | 'reviewing' | 'applying';
    const [enhancementStep, setEnhancementStep] = useState<EnhancementStep>('form');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [selectedChanges, setSelectedChanges] = useState<string[]>([]);
    
    // State for Sandbox Testing
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<string | null>(null);
    const [testError, setTestError] = useState<string | null>(null);

    // State for copy-to-clipboard feedback
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (activePrompt) {
            setPrompt(activePrompt.originalPrompt);
            setCategory(activePrompt.category);
            setModel(activePrompt.model || SUPPORTED_MODELS[0]);
        } else {
             // This case handles the initial state and clearing
            setPrompt('');
            setCategory(PROMPT_CATEGORIES[0]);
            setModel(SUPPORTED_MODELS[0]);
        }
        
        // When props change, reset the view state
        setError(null);
        setEnhancementStep('form');
        setSuggestions([]);
        setSelectedChanges([]);
        setTestResult(null);
        setTestError(null);
        setIsTesting(false);

    }, [activePrompt]);

    const handleGetSuggestions = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || enhancementStep !== 'form') return;

        setEnhancementStep('suggesting');
        setError(null);
        try {
            const suggestionsResult = await getEnhancementSuggestions(prompt, category, model);
            setSuggestions(suggestionsResult);
            setSelectedChanges(suggestionsResult); // Pre-select all suggestions
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
            // App component will update props, which will reset the view.
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred while applying changes.');
            setEnhancementStep('reviewing'); // Go back to review on failure
        }
    };

    const handleSelectionChange = (change: string, isSelected: boolean) => {
        setSelectedChanges(prev => {
            if (isSelected) {
                return [...prev, change];
            } else {
                return prev.filter(c => c !== change);
            }
        });
    };

    const handleTestPrompt = async () => {
        if (!enhancedResult?.enhancedPrompt || isTesting) return;
        
        setIsTesting(true);
        setTestResult(null);
        setTestError(null);
        try {
            const result = await generateTestResponse(enhancedResult.enhancedPrompt);
            setTestResult(result);
        } catch (err) {
            setTestError(err instanceof Error ? err.message : 'An unexpected error occurred during testing.');
        } finally {
            setIsTesting(false);
        }
    };
    
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isLoading = enhancementStep === 'suggesting' || enhancementStep === 'applying';
    const charCount = prompt.length;
    const maxChars = 2000;

    const renderForm = () => (
        <form onSubmit={handleGetSuggestions}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="prompt-category" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Category</label>
                    <select id="prompt-category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2.5 focus:ring-primary-500 focus:border-primary-500" disabled={isLoading || enhancementStep === 'reviewing'}>
                        {PROMPT_CATEGORIES.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                    </select>
                </div>
                <div>
                    <label htmlFor="target-model" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Target Model</label>
                    <select id="target-model" value={model} onChange={(e) => setModel(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2.5 focus:ring-primary-500 focus:border-primary-500" disabled={isLoading || enhancementStep === 'reviewing'}>
                        {SUPPORTED_MODELS.map(mod => (<option key={mod} value={mod}>{mod}</option>))}
                    </select>
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="prompt-input" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Your Prompt</label>
                <div className="relative">
                    <textarea id="prompt-input" rows={8} maxLength={maxChars} value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-3 focus:ring-primary-500 focus:border-primary-500 resize-y font-mono text-sm" placeholder="e.g., write a poem about the moon" disabled={isLoading || enhancementStep === 'reviewing'} />
                    <div className={`absolute bottom-2 right-2 text-xs ${charCount > maxChars * 0.9 ? 'text-red-500' : 'text-slate-400'}`}>{charCount} / {maxChars}</div>
                </div>
            </div>
            {enhancementStep !== 'reviewing' && (
                 <div className="flex justify-end">
                    <button type="submit" disabled={enhancementStep === 'suggesting' || !prompt.trim()} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all">
                        {enhancementStep === 'suggesting' ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Enhancing...</>) 
                        : (<><SparklesIcon className="-ml-1 mr-2 h-5 w-5" />Enhance Prompt</>)}
                    </button>
                </div>
            )}
        </form>
    );
    
    const renderResultView = () => (
        activePrompt && enhancedResult && (
            <div className="animate-fade-in">
                <div className="space-y-6">
                     <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Original Prompt</h3>
                        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono text-sm">{activePrompt.originalPrompt}</p>
                    </div>
                    <div className="bg-primary-50 dark:bg-slate-800/50 rounded-lg p-4 border border-primary-300 dark:border-primary-700">
                        <div className="flex justify-between items-center mb-2">
                             <h3 className="text-sm font-semibold text-primary-600 dark:text-primary-400">Enhanced Prompt</h3>
                            <button
                                onClick={() => handleCopy(enhancedResult.enhancedPrompt)}
                                className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                                <ClipboardIcon className="w-4 h-4" />
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">{enhancedResult.enhancedPrompt}</p>
                    </div>
                     <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-semibold mb-3 text-slate-600 dark:text-slate-300">Changes Applied</h3>
                        <ul className="space-y-2">
                            {enhancedResult.changes.map((change, index) => (
                                <li key={index} className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                    <span className="text-slate-700 dark:text-slate-300 text-sm">{change}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-6 text-center">
                    <button
                        onClick={handleTestPrompt}
                        disabled={isTesting}
                        className="inline-flex items-center px-6 py-2 border border-primary-600 text-sm font-medium rounded-md shadow-sm text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                        <PlayIcon className="-ml-1 mr-2 h-5 w-5" />
                        {isTesting ? 'Running Test...' : 'Test Prompt'}
                    </button>
                </div>
                {(isTesting || testResult || testError) && (
                    <SandboxResult 
                        isLoading={isTesting}
                        result={testResult}
                        error={testError}
                        onClose={() => { setTestResult(null); setTestError(null); }}
                    />
                )}
            </div>
        )
    );

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Prompt Enhancer</h2>
                 {/* FIX: Show "Start New" button during 'reviewing' and 'applying' states to allow cancellation. This resolves the reported unintentional comparison error. */}
                 {(enhancedResult || enhancementStep === 'reviewing' || enhancementStep === 'applying') && (
                    <button
                        onClick={onClear}
                        className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                    >
                        Start New
                    </button>
                 )}
            </div>

            {error && <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-md relative my-4 text-sm animate-fade-in" role="alert">{error}</div>}
            
            {!enhancedResult ? (
                <>
                    {renderForm()}
                    {enhancementStep === 'reviewing' && (
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
            ) : (
                renderResultView()
            )}
        </div>
    );
};

export default PromptEditor;