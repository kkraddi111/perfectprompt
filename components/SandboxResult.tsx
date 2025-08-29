import React from 'react';

interface SandboxResultProps {
    isLoading: boolean;
    result: string | null;
    error: string | null;
    onClose: () => void;
}

const SandboxResult: React.FC<SandboxResultProps> = ({ isLoading, result, error, onClose }) => {
    return (
        <div className="mt-8 animate-fade-in">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Gemini Test Result</h2>
                <button
                    onClick={onClose}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    title="Close sandbox result"
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
                     <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">{result}</p>
                )}
            </div>
        </div>
    );
};

export default SandboxResult;
