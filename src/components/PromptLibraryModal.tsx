import React, { useState } from 'react';
import { PROMPT_TEMPLATES } from '../templates';
import type { PromptTemplate } from '../types';
import Modal from './ui/Modal';

interface PromptLibraryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectTemplate: (template: PromptTemplate, category: string) => void;
}

const PromptLibraryModal: React.FC<PromptLibraryModalProps> = ({ isOpen, onClose, onSelectTemplate }) => {
    const [activeCategory, setActiveCategory] = useState(PROMPT_TEMPLATES[0].category);

    const selectedCategoryTemplates = PROMPT_TEMPLATES.find(c => c.category === activeCategory)?.templates || [];

    return (
        <Modal 
            isOpen={isOpen}
            onClose={onClose}
            title="Prompt Library"
            className="w-full max-w-4xl h-[80vh] max-h-[700px]"
        >
            <div className="flex-grow flex overflow-hidden">
                {/* Category Sidebar */}
                <nav className="w-1/3 md:w-1/4 p-4 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
                    <ul className="space-y-1">
                        {PROMPT_TEMPLATES.map(cat => (
                            <li key={cat.category}>
                                <button 
                                    onClick={() => setActiveCategory(cat.category)}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeCategory === cat.category 
                                        ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300' 
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {cat.category}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Templates View */}
                <main className="flex-1 p-6 overflow-y-auto">
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">{activeCategory}</h3>
                    <div className="space-y-4">
                        {selectedCategoryTemplates.map(template => (
                            <div key={template.title} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                <h4 className="font-bold text-slate-800 dark:text-slate-100">{template.title}</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-3">{template.description}</p>
                                <pre className="bg-slate-100 dark:bg-slate-900/50 p-3 rounded-md text-xs font-mono text-slate-600 dark:text-slate-300 whitespace-pre-wrap mb-4">
                                    <code>{template.prompt}</code>
                                </pre>
                                <div className="text-right">
                                    <button 
                                        onClick={() => onSelectTemplate(template, activeCategory)}
                                        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-800"
                                    >
                                        Use Template
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </Modal>
    );
};

export default PromptLibraryModal;