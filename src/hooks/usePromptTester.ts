import { useState, useCallback } from 'react';
import { generateTestResponse } from '@/services/geminiService';

/**
 * A custom hook to manage the state and logic for testing a prompt.
 * @param prompt The prompt string to be tested.
 * @returns An object containing the testing state and handler functions.
 */
export const usePromptTester = (prompt: string) => {
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<string | null>(null);
    const [testError, setTestError] = useState<string | null>(null);

    const handleTestPrompt = useCallback(async () => {
        setIsTesting(true);
        setTestResult(null);
        setTestError(null);
        try {
            const result = await generateTestResponse(prompt);
            setTestResult(result);
        } catch (err) {
            setTestError(err instanceof Error ? err.message : 'An unexpected error occurred during testing.');
        } finally {
            setIsTesting(false);
        }
    }, [prompt]);

    const handleCloseTest = useCallback(() => {
        setTestResult(null);
        setTestError(null);
    }, []);

    return {
        isTesting,
        testResult,
        testError,
        handleTestPrompt,
        handleCloseTest,
    };
};
