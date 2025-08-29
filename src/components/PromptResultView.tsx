import React, { useState } from 'react';
import type { EnhancedPromptResponse } from '@/types';
import { usePromptTester } from '@/hooks/usePromptTester';

import Button from '@/components/ui/Button';
import ClipboardIcon from '@/components/icons/ClipboardIcon';
import PlayIcon from '@/components/icons/PlayIcon';
import CheckCircleIcon from '@/components/icons/CheckCircleIcon';
import TestResultView from '@/components/ui/TestResultView';


interface PromptResultViewProps {
    originalPrompt: string;
    enhancedResult: EnhancedPromptResponse;
}

const PromptResultView: React.FC<PromptResultViewProps> = ({ originalPrompt, enhancedResult }) => {
    const {
        isTesting,
        testResult,
        testError,
        handleTestPrompt,
        handleCloseTest,
    } = usePromptTester(enhancedResult.enhancedPrompt);

    const [copied, setCopied] = useState(false);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    const showTestSection = isTesting || testResult || testError;

    return (
        <div className="animate-fade-in space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Original Prompt</h3>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono text-sm">{originalPrompt}</p>
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
                           <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700 dark:text-slate-300 text-sm">{change}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-6 text-center">
                <Button
                    onClick={handleTestPrompt}
                    isLoading={isTesting}
                    variant="ghost"
                    icon={<PlayIcon />}
                >
                    {isTesting ? 'Running Test...' : 'Test Prompt'}
                </Button>
            </div>

            {showTestSection && (
                <TestResultView
                    isLoading={isTesting}
                    result={testResult}
                    error={testError}
                    onClose={handleCloseTest}
                />
            )}
        </div>
    );
};

export default PromptResultView;
