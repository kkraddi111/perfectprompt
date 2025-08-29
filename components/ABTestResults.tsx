import React from 'react';
import type { ABTestResult } from '../types';

interface ABTestResultsProps {
    isLoading: boolean;
    result: ABTestResult | null;
    error: string | null;
    onClose: () => void;
    hasVariationB: boolean;
}

const ABTestResults: React.FC<ABTestResultsProps> = ({ isLoading, result, error, onClose, hasVariationB }) => {
    return (
        <div className="mt-8 animate-fade-in">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Test Results</h2>
                <button
                    onClick={onClose}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    title="Close test results"
                >
                    &times; Close
                </button>
             </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6 border border-slate-200 dark:border-slate-700 min-h-[150px]">
                {isLoading && (
                    <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center text-slate-500 dark:text-slate-400">
                             <svg className="animate-spin h-8 w-8 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Generating response...</span>
                        </div>
                    </div>
                )}
                {error && (
                     <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-md text-sm" role="alert">
                        <strong>Error:</strong> {error}
                    </div>
                )}
                {result && (
                     <div className={`grid grid-cols-1 ${hasVariationB ? 'md:grid-cols-2' : ''} gap-6`}>
                        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                             <h3 className="text-lg font-semibold mb-3 text-primary-600 dark:text-primary-400">Result A</h3>
                             <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">{result.a}</p>
                        </div>
                         {hasVariationB && (
                            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                <h3 className="text-lg font-semibold mb-3 text-slate-600 dark:text-slate-300">Result B</h3>
                                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">{result.b}</p>
                            </div>
                        )}
                     </div>
                )}
            </div>
        </div>
    );
};

export default ABTestResults;