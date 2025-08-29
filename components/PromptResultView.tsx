import React, { useState } from 'react';
import type { EnhancedPromptResponse } from '../types';
import { generateTestResponse } from '../services/geminiService';

import Button from './ui/Button';
import Spinner from './ui/Spinner';
import ClipboardIcon from './icons/ClipboardIcon';
import PlayIcon from './icons/PlayIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface PromptResultViewProps {
    originalPrompt: string;
    enhancedResult: EnhancedPromptResponse;
}

const PromptResultView: React.FC<PromptResultViewProps> = ({ originalPrompt, enhancedResult }) => {
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<string | null>(null);
    const [testError, setTestError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleTestPrompt = async () => {
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
                 <div className="mt-8 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Gemini Test Result</h2>
                        <button
                            onClick={() => { setTestResult(null); setTestError(null); }}
                            className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            title="Close sandbox result"
                        >
                            &times; Close
                        </button>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6 border border-slate-200 dark:border-slate-700 min-h-[150px]">
                        {isTesting && (
                             <div className="flex items-center justify-center h-full">
                                <div className="flex flex-col items-center text-slate-500 dark:text-slate-400">
                                    <Spinner size="h-8 w-8" className="mb-2" />
                                    <span>Generating response...</span>
                                </div>
                            </div>
                        )}
                        {testError && (
                            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-md text-sm" role="alert">
                                <strong>Error:</strong> {testError}
                            </div>
                        )}
                        {testResult && (
                            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">{testResult}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromptResultView;
