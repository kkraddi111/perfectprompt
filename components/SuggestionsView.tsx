import React from 'react';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface SuggestionsViewProps {
    suggestions: string[];
    selectedChanges: string[];
    onSelectionChange: (change: string, isSelected: boolean) => void;
    onApply: () => void;
    onCancel: () => void;
    isApplying: boolean;
}

const SuggestionsView: React.FC<SuggestionsViewProps> = ({
    suggestions,
    selectedChanges,
    onSelectionChange,
    onApply,
    onCancel,
    isApplying
}) => {
    const isAllSelected = suggestions.length > 0 && selectedChanges.length === suggestions.length;

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            suggestions.forEach(suggestion => {
                if (!selectedChanges.includes(suggestion)) {
                    onSelectionChange(suggestion, true);
                }
            });
        } else {
             suggestions.forEach(suggestion => {
                if (selectedChanges.includes(suggestion)) {
                    onSelectionChange(suggestion, false);
                }
            });
        }
    };
    
    return (
        <div className="mt-6 animate-fade-in border-t border-slate-200 dark:border-slate-700 pt-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Review Suggestions</h3>
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                 <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-600">
                    <label htmlFor="select-all" className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                        <input
                            id="select-all"
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                            className="h-4 w-4 rounded border-slate-300 dark:border-slate-500 text-primary-600 focus:ring-primary-500 bg-transparent dark:bg-slate-700"
                        />
                        <span className="ml-2">Select All</span>
                    </label>
                </div>
                {suggestions.map((suggestion, index) => (
                    <div key={index} className="relative flex items-start">
                        <div className="flex h-6 items-center">
                            <input
                                id={`suggestion-${index}`}
                                name={`suggestion-${index}`}
                                type="checkbox"
                                checked={selectedChanges.includes(suggestion)}
                                onChange={(e) => onSelectionChange(suggestion, e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 dark:border-slate-500 text-primary-600 focus:ring-primary-500 bg-transparent dark:bg-slate-700"
                            />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                            <label htmlFor={`suggestion-${index}`} className="font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                                {suggestion}
                            </label>
                        </div>
                    </div>
                ))}
            </div>

             <div className="flex justify-end gap-3 mt-4">
                <button
                    onClick={onCancel}
                    disabled={isApplying}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                >
                    Back
                </button>
                <button
                    onClick={onApply}
                    disabled={isApplying || selectedChanges.length === 0}
                    className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all"
                >
                    {isApplying ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Applying...
                        </>
                    ) : (
                        <>
                           <CheckCircleIcon className="-ml-1 mr-2 h-5 w-5" />
                           Apply Changes
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default SuggestionsView;
