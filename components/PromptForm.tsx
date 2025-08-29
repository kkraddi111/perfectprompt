import React, { useState, useEffect } from 'react';
import { PROMPT_CATEGORIES, SUPPORTED_MODELS } from '../constants';
import Button from './ui/Button';
import SparklesIcon from './icons/SparklesIcon';

interface PromptFormProps {
    initialPrompt: string;
    initialCategory: string;
    initialModel: string;
    onSubmit: (prompt: string, category: string, model: string) => void;
    isLoading: boolean;
    isEditingDisabled: boolean;
}

const MAX_CHARS = 2000;

const PromptForm: React.FC<PromptFormProps> = ({
    initialPrompt,
    initialCategory,
    initialModel,
    onSubmit,
    isLoading,
    isEditingDisabled
}) => {
    const [prompt, setPrompt] = useState(initialPrompt);
    const [category, setCategory] = useState(initialCategory);
    const [model, setModel] = useState(initialModel);
    
    useEffect(() => {
        setPrompt(initialPrompt);
        setCategory(initialCategory);
        setModel(initialModel);
    }, [initialPrompt, initialCategory, initialModel]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(prompt, category, model);
    };

    const charCount = prompt.length;

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="prompt-category" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Category</label>
                    <select id="prompt-category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2.5 focus:ring-primary-500 focus:border-primary-500" disabled={isEditingDisabled}>
                        {PROMPT_CATEGORIES.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                    </select>
                </div>
                <div>
                    <label htmlFor="target-model" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Target Model</label>
                    <select id="target-model" value={model} onChange={(e) => setModel(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2.5 focus:ring-primary-500 focus:border-primary-500" disabled={isEditingDisabled}>
                        {SUPPORTED_MODELS.map(mod => (<option key={mod} value={mod}>{mod}</option>))}
                    </select>
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="prompt-input" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Your Prompt</label>
                <div className="relative">
                    <textarea id="prompt-input" rows={8} maxLength={MAX_CHARS} value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-3 focus:ring-primary-500 focus:border-primary-500 resize-y font-mono text-sm" placeholder="e.g., write a poem about the moon" disabled={isEditingDisabled} />
                    <div className={`absolute bottom-2 right-2 text-xs ${charCount > MAX_CHARS * 0.9 ? 'text-red-500' : 'text-slate-400'}`}>{charCount} / {MAX_CHARS}</div>
                </div>
            </div>
            {!isEditingDisabled && (
                 <div className="flex justify-end">
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        disabled={!prompt.trim()}
                        icon={<SparklesIcon />}
                        className="px-6 py-3 text-base"
                    >
                        {isLoading ? 'Enhancing...' : 'Enhance Prompt'}
                    </Button>
                </div>
            )}
        </form>
    );
};

export default PromptForm;
