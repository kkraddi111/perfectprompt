import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import PromptEditor from './components/PromptEditor';
import HistoryPanel from './components/HistoryPanel';
import PromptLibraryModal from './components/PromptLibraryModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { PromptHistoryItem, EnhancedPromptResponse, PromptTemplate } from './types';

const App: React.FC = () => {
    const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'dark');
    const [history, setHistory] = useLocalStorage<PromptHistoryItem[]>('prompt-history', []);
    const [activePrompt, setActivePrompt] = useState<{ originalPrompt: string; category: string } | null>(null);
    const [enhancedResult, setEnhancedResult] = useState<EnhancedPromptResponse | null>(null);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'dark' ? 'light' : 'dark');
        root.classList.add(theme);
    }, [theme]);

    const handleNewEnhancedPrompt = useCallback((originalPrompt: string, category: string, response: EnhancedPromptResponse) => {
        setEnhancedResult(response);
        setActivePrompt({ originalPrompt, category });
        
        const newHistoryItem: PromptHistoryItem = {
            id: new Date().toISOString(),
            originalPrompt,
            enhancedPrompt: response.enhancedPrompt,
            category,
            changes: response.changes,
            timestamp: Date.now()
        };
        setHistory(prevHistory => [newHistoryItem, ...prevHistory].slice(0, 50)); // Limit history size
    }, [setHistory]);

    const handleLoadHistory = useCallback((item: PromptHistoryItem) => {
        setActivePrompt({ originalPrompt: item.originalPrompt, category: item.category });
        setEnhancedResult({ enhancedPrompt: item.enhancedPrompt, changes: item.changes });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleDeleteHistory = useCallback((id: string) => {
        setHistory(prev => prev.filter(item => item.id !== id));
    }, [setHistory]);

    const handleClearCurrent = () => {
        setActivePrompt(null);
        setEnhancedResult(null);
    }

    const handleSelectTemplate = useCallback((template: PromptTemplate, category: string) => {
        handleClearCurrent();
        setActivePrompt({ originalPrompt: template.prompt, category: category });
        setIsLibraryOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div className="bg-slate-100 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">
            <Header theme={theme} setTheme={setTheme} onOpenLibrary={() => setIsLibraryOpen(true)} />
            <main className="container mx-auto p-4 md:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <PromptEditor
                            onNewEnhancedPrompt={handleNewEnhancedPrompt}
                            activePrompt={activePrompt}
                            enhancedResult={enhancedResult}
                            onClear={handleClearCurrent}
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <HistoryPanel
                            history={history}
                            onLoad={handleLoadHistory}
                            onDelete={handleDeleteHistory}
                        />
                    </div>
                </div>
            </main>
            <PromptLibraryModal
                isOpen={isLibraryOpen}
                onClose={() => setIsLibraryOpen(false)}
                onSelectTemplate={handleSelectTemplate}
            />
        </div>
    );
};

export default App;
