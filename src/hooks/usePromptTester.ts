import { useState, useCallback } from 'react';
import { generateTestResponse } from '../services/geminiService';

/**
 * A custom hook to manage the state and logic for testing a prompt with the Gemini API.
 */
export const usePromptTester = () => {
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<string | null>(null);
    const [testError, setTestError] = useState<string | null>(null);

    const testPrompt = useCallback(async (promptToTest: string) => {
        if (!promptToTest) return;
        
        setIsTesting(true);
        setTestResult(null);
        setTestError(null);
        
        try {
            const result = await generateTestResponse(promptToTest);
            setTestResult(result);
        } catch (err) {
            setTestError(err instanceof Error ? err.message : 'An unexpected error occurred during testing.');
        } finally {
            setIsTesting(false);
        }
    }, []);

    const closeTest = useCallback(() => {
        setTestResult(null);
        setTestError(null);
    }, []);
    
    // Derived state to determine if the test result view should be visible
    const showTestSection = isTesting || testResult !== null || testError !== null;

    return { isTesting, testResult, testError, testPrompt, closeTest, showTestSection };
};
