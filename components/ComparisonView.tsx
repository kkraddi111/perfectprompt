import React, { useState } from 'react';
import ClipboardIcon from './icons/ClipboardIcon';

interface ComparisonViewProps {
    originalPrompt: string;
    enhancedPrompt: string;
    changes: string[];
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ originalPrompt, enhancedPrompt, changes }) => {
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
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            title="Copy to clipboard"
                        >
                            <ClipboardIcon className="w-4 h-4" />
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
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
