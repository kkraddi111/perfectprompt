import React from 'react';
import XMarkIcon from '../icons/XMarkIcon';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className = '' }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div 
                className={`bg-white dark:bg-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700 ${className}`}
                onClick={e => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <h2 id="modal-title" className="text-xl font-bold text-slate-800 dark:text-white">{title}</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close modal">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>
                {children}
            </div>
        </div>
    );
};

export default Modal;