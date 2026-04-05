import { create } from 'zustand';
import { submitDiscoveryProfile, DiscoveryInsightsResponse, AssessmentAnswers } from '../api/discoveryApi';

export type FunnelStep = 'assessment' | 'goal' | 'insights';

interface DiscoveryState {
    // Engine State
    currentStep: FunnelStep;
    answers: AssessmentAnswers;
    userGoal: string;
    
    // Output State
    insights: DiscoveryInsightsResponse | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    setAnswer: (questionId: string, value: number) => void;
    setGoal: (goal: string) => void;
    nextStep: () => void;
    generateInsights: () => Promise<void>;
    resetModule: () => void;
}

export const useDiscoveryStore = create<DiscoveryState>((set, get) => ({
    currentStep: 'assessment',
    answers: {},
    userGoal: '',
    
    insights: null,
    isLoading: false,
    error: null,

    setAnswer: (questionId, value) => {
        set((state) => ({
            answers: { ...state.answers, [questionId]: value },
            error: null
        }));
    },
    
    setGoal: (goal) => set({ userGoal: goal, error: null }),

    nextStep: () => {
        const { currentStep, answers, userGoal } = get();
        
        // Validation per step
        if (currentStep === 'assessment') {
            if (Object.keys(answers).length < 3) {
                set({ error: 'Please answer all questions to proceed.' });
                return;
            }
            set({ currentStep: 'goal', error: null });
        } else if (currentStep === 'goal') {
            if (!userGoal.trim()) {
                set({ error: 'Please enter a goal to align your traits with.' });
                return;
            }
            get().generateInsights();
        }
    },

    generateInsights: async () => {
        const { answers, userGoal } = get();

        set({ 
            currentStep: 'insights', 
            isLoading: true, 
            error: null 
        });

        try {
            const response = await submitDiscoveryProfile(answers, userGoal);
            
            set({ 
                insights: response,
                isLoading: false
            });

            // Sync progress
            import('@/store/useProgressStore').then(module => {
                module.useProgressStore.getState().incrementMetric('personality', 5, { action: 'self_discovery' });
            });
        } catch (error) {
            set({ 
                isLoading: false, 
                error: 'An unexpected error occurred building your profile.'
            });
        }
    },

    resetModule: () => set({
        currentStep: 'assessment',
        answers: {},
        userGoal: '',
        insights: null,
        isLoading: false,
        error: null
    })
}));
