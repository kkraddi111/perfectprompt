import React from 'react';
import ThemeToggle from './ThemeToggle';
import SparklesIcon from './icons/SparklesIcon';

interface HeaderProps {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
}

const Header: React.FC<HeaderProps> = ({ theme, setTheme }) => {
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
                    <ThemeToggle theme={theme} setTheme={setTheme} />
                </div>
            </div>
        </header>
    );
};

export default Header;
