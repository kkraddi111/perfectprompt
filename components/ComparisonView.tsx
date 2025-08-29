import React, { useState } from 'react';
import ClipboardIcon from './icons/ClipboardIcon';
import BeakerIcon from './icons/BeakerIcon';
import PlusCircleIcon from './icons/PlusCircleIcon';

interface ComparisonViewProps {
    originalPrompt: string;
    enhancedPrompt: string; // This is now "Variation A"
    changes: string[];
    onRunTest: () => void;
    isTesting: boolean;
    promptVariationB: string | null;
    onCreateVariation: () => void;
    onVariationChange: (value: string) => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ 
    originalPrompt, 
    enhancedPrompt, 
    changes, 
    onRunTest, 
    isTesting,
    promptVariationB,
    onCreateVariation,
    onVariationChange
}) => {
    const [copiedA, setCopiedA] = useState(false);
    const [copiedB, setCopiedB] = useState(false);

    const handleCopy = (text: string, variant: 'A' | 'B') => {
        navigator.clipboard.writeText(text);
        if (variant === 'A') {
            setCopiedA(true);
            setTimeout(() => setCopiedA(false), 2000);
        } else {
            setCopiedB(true);
            setTimeout(() => setCopiedB(false), 2000);
        }
    };

    const hasVariationB = promptVariationB !== null;

    return (
        <div className="mt-8 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">A/B Test Workbench</h2>
                <button
                    onClick={onRunTest}
                    disabled={isTesting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                >
                    {isTesting ? (
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <BeakerIcon className="-ml-1 mr-2 h-5 w-5" />
                    )}
                    {isTesting ? 'Running...' : (hasVariationB ? 'Run A/B Test' : 'Run Test')}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Variation A */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6 border border-primary-300 dark:border-primary-700 flex flex-col">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-400">Variation A</h3>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => handleCopy(enhancedPrompt, 'A')}
                                className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                                <ClipboardIcon className="w-4 h-4" />
                                {copiedA ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                    <p className="flex-grow text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">{enhancedPrompt}</p>
                </div>

                {/* Variation B */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6 border border-slate-200 dark:border-slate-700 flex flex-col">
                    {hasVariationB ? (
                        <>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300">Variation B</h3>
                                 <button
                                    onClick={() => handleCopy(promptVariationB, 'B')}
                                    className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                    <ClipboardIcon className="w-4 h-4" />
                                    {copiedB ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                            <textarea
                                value={promptVariationB}
                                onChange={(e) => onVariationChange(e.target.value)}
                                className="w-full h-full flex-grow bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-3 focus:ring-primary-500 focus:border-primary-500 resize-y font-mono text-sm"
                                rows={enhancedPrompt.split('\n').length}
                            />
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <button onClick={onCreateVariation} className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                <PlusCircleIcon className="w-10 h-10" />
                                <span className="font-semibold">Create Variation</span>
                                <span className="text-sm">Tweak the prompt to test an alternative.</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold mb-4 text-slate-600 dark:text-slate-300">Changes Applied to Variation A</h3>
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