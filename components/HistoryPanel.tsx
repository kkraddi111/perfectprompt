import React from 'react';
import type { PromptHistoryItem } from '../types';
import TrashIcon from './icons/TrashIcon';

interface HistoryPanelProps {
    history: PromptHistoryItem[];
    onLoad: (item: PromptHistoryItem) => void;
    onDelete: (id: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onLoad, onDelete }) => {

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((new Date().getTime() - timestamp) / 1000);
        if (seconds < 5) return "just now";
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-700 h-full">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">History</h2>
            {history.length === 0 ? (
                <div className="text-center text-slate-500 dark:text-slate-400 py-10 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                    <p>Your enhanced prompts will appear here.</p>
                </div>
            ) : (
                <ul className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-2 -mr-2">
                    {history.map(item => (
                        <li key={item.id} className="group p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-primary-50 dark:hover:bg-slate-700 transition-colors cursor-pointer" onClick={() => onLoad(item)}>
                            <div className="flex justify-between items-start">
                                <div className="text-left flex-1 overflow-hidden">
                                    <p className="text-sm font-semibold text-primary-700 dark:text-primary-400 truncate">{item.originalPrompt}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        {item.category} &middot; {timeAgo(item.timestamp)}
                                        {item.model && <span className="ml-2 pl-2 border-l border-slate-300 dark:border-slate-600">{item.model}</span>}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                                    className="ml-4 p-1.5 rounded-full text-slate-400 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                    title="Delete item"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HistoryPanel;