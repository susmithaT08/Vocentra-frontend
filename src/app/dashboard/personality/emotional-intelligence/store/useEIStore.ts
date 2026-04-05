import { create } from 'zustand';
import { eiService } from '../api/eiService';

export type MoodType = 'Great' | 'Good' | 'Okay' | 'Stressed' | 'Exhausted' | 'Anxious' | null;

export interface AIFeedback {
    strengths: string[];
    empathyMessage: string;
    actionableAdvice: string[];
    emotionalHealthScore: number;
}

export interface EIRecord {
    _id: string;
    mood: MoodType;
    reflection: string;
    aiFeedback: AIFeedback;
    createdAt: string;
}

interface EIState {
    currentMood: MoodType;
    reflectionText: string;
    history: EIRecord[];
    isLoading: boolean;
    error: string | null;
    currentFeedback: AIFeedback | null;
    
    // Actions
    setMood: (mood: MoodType) => void;
    setReflectionText: (text: string) => void;
    fetchHistory: () => Promise<void>;
    submitReflection: () => Promise<void>;
    resetCurrentSession: () => void;
}

export const useEIStore = create<EIState>((set, get) => ({
    currentMood: null,
    reflectionText: '',
    history: [],
    isLoading: false,
    error: null,
    currentFeedback: null,

    setMood: (mood) => set({ currentMood: mood }),
    setReflectionText: (text) => set({ reflectionText: text }),

    fetchHistory: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await eiService.getHistory();
            set({ history: data, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch history', isLoading: false });
        }
    },

    submitReflection: async () => {
        const { currentMood, reflectionText } = get();
        if (!currentMood || !reflectionText.trim()) {
            set({ error: 'Please select a mood and write a reflection.' });
            return;
        }

        set({ isLoading: true, error: null });
        try {
            const data = await eiService.submitReflection(currentMood, reflectionText);
            set((state) => ({
                currentFeedback: data.aiFeedback,
                history: [data, ...state.history],
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to submit reflection', isLoading: false });
        }
    },

    resetCurrentSession: () => set({
        currentMood: null,
        reflectionText: '',
        currentFeedback: null,
        error: null
    })
}));
