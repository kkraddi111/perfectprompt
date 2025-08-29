import React, { useState } from 'react';
import Button from './ui/Button';

interface ApiKeyManagerProps {
    apiKey: string | null;
    onSetApiKey: (key: string) => void;
    onRemoveApiKey: () => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ apiKey, onSetApiKey, onRemoveApiKey }) => {
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');

    const handleSave = () => {
        if (!inputValue.trim()) {
            setError('API Key cannot be empty.');
            return;
        }
        setError('');
        onSetApiKey(inputValue.trim());
        setInputValue('');
    };

    const handleRemove = () => {
        onRemoveApiKey();
    };

    const obscureApiKey = (key: string): string => {
        if (key.length < 12) {
            return '********************';
        }
        return `${key.substring(0, 4)}********************${key.substring(key.length - 4)}`;
    };

    return (
        <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Gemini API Key</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Your API key is stored securely in your browser's local storage and is never sent anywhere else.
            </p>

            {apiKey ? (
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg flex items-center justify-between border border-slate-200 dark:border-slate-600">
                    <code className="text-sm text-slate-600 dark:text-slate-300 font-mono tracking-wider">{obscureApiKey(apiKey)}</code>
                    <Button onClick={handleRemove} variant="secondary">
                        Remove
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            You can get your free Gemini API key from {' '}
                            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="font-medium underline hover:text-blue-600 dark:hover:text-blue-100">
                                Google AI Studio
                            </a>.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="password"
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                if (error) setError('');
                            }}
                            placeholder="Enter your Gemini API key"
                            className="flex-grow w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2.5 focus:ring-primary-500 focus:border-primary-500"
                            aria-label="Gemini API Key Input"
                        />
                         <Button onClick={handleSave} disabled={!inputValue.trim()}>
                            Save Key
                        </Button>
                    </div>
                    {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
                </div>
            )}
        </div>
    );
};

export default ApiKeyManager;