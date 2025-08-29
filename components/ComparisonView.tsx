import React, { useState } from 'react';
import ClipboardIcon from './icons/ClipboardIcon';
import PlayIcon from './icons/PlayIcon';

interface ComparisonViewProps {
    originalPrompt: string;
    enhancedPrompt: string;
    changes: string[];
    onTest: () => void;
    isTesting: boolean;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ originalPrompt, enhancedPrompt, changes, onTest, isTesting }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(enhancedPrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mt-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Enhancement Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold mb-3 text-slate-600 dark:text-slate-300">Original Prompt</h3>
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">{originalPrompt}</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6 border border-primary-300 dark:border-primary-700">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-400">Enhanced Prompt</h3>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                title="Copy to clipboard"
                            >
                                <ClipboardIcon className="w-4 h-4" />
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                             <button
                                onClick={onTest}
                                disabled={isTesting}
                                className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors disabled:opacity-50 disabled:cursor-wait"
                                title="Test prompt with Gemini"
                            >
                                {isTesting ? (
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <PlayIcon className="w-4 h-4" />
                                )}
                                {isTesting ? 'Generating...' : 'Test'}
                            </button>
                        </div>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">{enhancedPrompt}</p>
                </div>
            </div>

            <div className="mt-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold mb-4 text-slate-600 dark:text-slate-300">Changes Applied</h3>
                <ul className="space-y-3">
                    {changes.map((change, index) => (
                        <li key={index} className="flex items-start">
                            <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-slate-700 dark:text-slate-300">{change}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ComparisonView;