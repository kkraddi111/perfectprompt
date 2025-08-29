import React from 'react';
import { FOUNDATIONAL_TECHNIQUES, ADVANCED_TECHNIQUES } from '@/techniques';
import Modal from '@/components/ui/Modal';
import type { PromptingTechnique } from '@/types';

interface PromptingTechniquesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TechniqueSection: React.FC<{ title: string; techniques: PromptingTechnique[] }> = ({ title, techniques }) => (
    <div>
        <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">{title}</h3>
        <div className="space-y-6">
            {techniques.map(technique => (
                <div key={technique.name} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h4 className="font-bold text-lg text-primary-600 dark:text-primary-400">{technique.name}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 mb-3">{technique.description}</p>
                    <div className="bg-slate-100 dark:bg-slate-900/50 p-3 rounded-md">
                        <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Example</h5>
                        <pre className="text-xs font-mono text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                            <code>{technique.example}</code>
                        </pre>
                    </div>
                </div>
            ))}
        </div>
    </div>
);


const PromptingTechniquesModal: React.FC<PromptingTechniquesModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Prompting Techniques"
            className="w-full max-w-3xl h-[90vh] md:h-[80vh] max-h-[700px]"
        >
            <main className="flex-1 p-6 overflow-y-auto">
                 <div className="space-y-10">
                    <TechniqueSection title="Foundational Techniques" techniques={FOUNDATIONAL_TECHNIQUES} />
                    <TechniqueSection title="Advanced Techniques" techniques={ADVANCED_TECHNIQUES} />
                </div>
            </main>
        </Modal>
    );
};

export default PromptingTechniquesModal;