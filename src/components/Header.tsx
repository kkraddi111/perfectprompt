import React from 'react';
import ThemeToggle from './ThemeToggle';
import SparklesIcon from './icons/SparklesIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import LightBulbIcon from './icons/LightBulbIcon';
import CogIcon from './icons/CogIcon';

interface HeaderProps {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    onOpenLibrary: () => void;
    onOpenTechniques: () => void;
    onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, setTheme, onOpenLibrary, onOpenTechniques, onOpenSettings }) => {
    return (
        <header className="bg-white dark:bg-slate-800/50 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-3">
                        <SparklesIcon className="w-8 h-8 text-primary-500" />
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            PerfectPrompt
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                         <button
                            onClick={onOpenTechniques}
                            className="flex items-center gap-2 p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 focus:ring-primary-500 transition-colors text-sm font-medium"
                            aria-label="Learn prompting techniques"
                        >
                            <LightBulbIcon className="w-5 h-5" />
                            Learn Techniques
                        </button>
                         <button
                            onClick={onOpenLibrary}
                            className="flex items-center gap-2 p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 focus:ring-primary-500 transition-colors text-sm font-medium"
                            aria-label="Open prompt library"
                        >
                            <BookOpenIcon className="w-5 h-5" />
                            Templates
                        </button>
                        <button
                            onClick={onOpenSettings}
                            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 focus:ring-primary-500 transition-colors"
                            aria-label="Open settings"
                        >
                            <CogIcon className="w-6 h-6" />
                        </button>
                        <ThemeToggle theme={theme} setTheme={setTheme} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;