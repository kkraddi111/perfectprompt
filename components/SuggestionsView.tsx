import React from 'react';
import CheckCircleIcon from './icons/CheckCircleIcon';
import Button from './ui/Button';

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
        const isChecked = e.target.checked;
        suggestions.forEach(suggestion => {
            const isCurrentlySelected = selectedChanges.includes(suggestion);
            if (isChecked && !isCurrentlySelected) {
                onSelectionChange(suggestion, true);
            } else if (!isChecked && isCurrentlySelected) {
                onSelectionChange(suggestion, false);
            }
        });
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
                <Button
                    onClick={onCancel}
                    disabled={isApplying}
                    variant="secondary"
                >
                    Back
                </Button>
                <Button
                    onClick={onApply}
                    isLoading={isApplying}
                    disabled={selectedChanges.length === 0}
                    icon={<CheckCircleIcon />}
                    className="px-6"
                >
                    {isApplying ? 'Applying...' : 'Apply Changes'}
                </Button>
            </div>
        </div>
    );
};

export default SuggestionsView;