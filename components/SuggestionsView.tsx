import React from 'react';
import type { Suggestion } from '../types';
import CheckCircleIcon from './icons/CheckCircleIcon';
import Button from './ui/Button';

interface SuggestionsViewProps {
    suggestions: Suggestion[];
    selectedChanges: string[];
    onSelectionChange: (change: string, isSelected: boolean) => void;
    onApply: () => void;
    onCancel: () => void;
    isApplying: boolean;
}

const techniqueColors: { [key: string]: string } = {
    'Role Prompting': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'Add Context': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'Few-Shot Prompting': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    'Add Constraints': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    'Specify Format': 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300',
    'Chain-of-Thought': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
    'default': 'bg-slate-100 text-slate-800 dark:bg-slate-600 dark:text-slate-200',
};

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
        suggestions.forEach(suggestionItem => {
            const isCurrentlySelected = selectedChanges.includes(suggestionItem.suggestion);
            if (isChecked && !isCurrentlySelected) {
                onSelectionChange(suggestionItem.suggestion, true);
            } else if (!isChecked && isCurrentlySelected) {
                onSelectionChange(suggestionItem.suggestion, false);
            }
        });
    };
    
    return (
        <div className="mt-6 animate-fade-in border-t border-slate-200 dark:border-slate-700 pt-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Review Suggestions</h3>
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
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
                {suggestions.map((suggestionItem, index) => (
                    <div key={index} className="relative flex items-start">
                        <div className="flex h-6 items-center">
                            <input
                                id={`suggestion-${index}`}
                                name={`suggestion-${index}`}
                                type="checkbox"
                                checked={selectedChanges.includes(suggestionItem.suggestion)}
                                onChange={(e) => onSelectionChange(suggestionItem.suggestion, e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 dark:border-slate-500 text-primary-600 focus:ring-primary-500 bg-transparent dark:bg-slate-700"
                            />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                            <label htmlFor={`suggestion-${index}`} className="font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                                 <span className={`inline-block mb-1.5 px-2 py-0.5 text-xs font-semibold rounded-full ${techniqueColors[suggestionItem.technique] || techniqueColors.default}`}>
                                    {suggestionItem.technique}
                                 </span>
                                 <br/>
                                {suggestionItem.suggestion}
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