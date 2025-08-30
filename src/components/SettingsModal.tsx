import React from 'react';
import Modal from './ui/Modal';
import ApiKeyManager from './ApiKeyManager';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    apiKey: string | null;
    onSetApiKey: (key: string) => void;
    onRemoveApiKey: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
    isOpen, 
    onClose, 
    apiKey,
    onSetApiKey,
    onRemoveApiKey
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Settings"
            className="w-full max-w-lg"
        >
            <main className="p-6">
                <ApiKeyManager 
                    apiKey={apiKey}
                    onSetApiKey={onSetApiKey}
                    onRemoveApiKey={onRemoveApiKey}
                />
            </main>
        </Modal>
    );
};

export default SettingsModal;