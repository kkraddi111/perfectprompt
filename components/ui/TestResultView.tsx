import React from 'react';
import Spinner from './Spinner';

interface TestResultViewProps {
    isLoading: boolean;
    result: string | null;
    error: string | null;
    onClose: () => void;
    title?: string;
}

const TestResultView: React.FC<TestResultViewProps> = ({ isLoading, result, error, onClose, title = "Gemini Test Result" }) => {
    return (
        <div className="mt-8 animate-fade-in">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h2>
                <button
                    onClick={onClose}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    title="Close result"
                >
                    &times; Close
                </button>
             </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6 border border-slate-200 dark:border-slate-700 min-h-[150px]">
                {isLoading && (
                    <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center text-slate-500 dark:text-slate-400">
                             <Spinner size="h-8 w-8" className="mb-2" />
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
                     <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">{result}</p>
                )}
            </div>
        </div>
    );
};

export default TestResultView;
