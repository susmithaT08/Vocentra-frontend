import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LinkedinAnalysis {
    overallScore: number;
    scoreBreakdown: {
        headline: number;
        about: number;
        experience: number;
        skills: number;
        visibility: number;
    };
    feedback: {
        strengths: string[];
        gaps: string[];
    };
    sectionSuggestions: {
        headline: string;
        about: string;
        experience: string;
        skills: string;
        completeness: string;
    };
    keywordOptimization: string[];
    visibilityTips: string[];
    sampleSnippets: Array<{
        section: string;
        before: string;
        after: string;
    }>;
}

interface LinkedinState {
    analysisResult: LinkedinAnalysis | null;
    isLoading: boolean;
    error: string | null;
    needsManualInput: boolean;
    isUnauthorized: boolean;
    
    setAnalysis: (result: LinkedinAnalysis) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setManualInputNeeded: (needed: boolean) => void;
    setUnauthorized: (unauthorized: boolean) => void;
    reset: () => void;
}

export const useLinkedinStore = create<LinkedinState>()(
    persist(
        (set) => ({
            analysisResult: null,
            isLoading: false,
            error: null,
            needsManualInput: false,
            isUnauthorized: false,

            setAnalysis: (analysisResult) => set({ analysisResult, error: null, needsManualInput: false, isUnauthorized: false }),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error, isLoading: false }),
            setManualInputNeeded: (needsManualInput) => set({ needsManualInput, isLoading: false }),
            setUnauthorized: (isUnauthorized) => set({ isUnauthorized, isLoading: false }),
            reset: () => set({ analysisResult: null, error: null, needsManualInput: false, isLoading: false, isUnauthorized: false })
        }),
        {
            name: 'vocentra-linkedin-optimizer-storage'
        }
    )
);
