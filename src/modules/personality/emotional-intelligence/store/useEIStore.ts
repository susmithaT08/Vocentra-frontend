import { create } from 'zustand';
import { submitEmotionalReflection } from '../api/eiApi';
import { useProgressStore } from '@/store/useProgressStore';

export type Mood = 'Happy' | 'Neutral' | 'Sad' | 'Angry' | 'Anxious' | null;

interface EIState {
    // State
    mood: Mood;
    reflectionText: string;
    feedback: string | null;
    isLoading: boolean;
    error: string | null;
    lastLogTimestamp: string | null;

    // Actions
    setMood: (mood: Mood) => void;
    setReflectionText: (text: string) => void;
    submitReflection: () => Promise<void>;
    resetModule: () => void;
}

export const useEIStore = create<EIState>((set, get) => ({
    mood: null,
    reflectionText: '',
    feedback: null,
    isLoading: false,
    error: null,
    lastLogTimestamp: null,

    setMood: (mood) => set({ mood, error: null }),
    
    setReflectionText: (text) => set({ reflectionText: text, error: null }),

    submitReflection: async () => {
        const { mood, reflectionText } = get();
        
        // Strict local validation
        if (!mood) {
            set({ error: 'Please select a mood before reflecting.' });
            return;
        }
        if (!reflectionText.trim()) {
            set({ error: 'Please write a brief reflection.' });
            return;
        }

        set({ isLoading: true, error: null });

        try {
            // Wait for isolated API request
            const response = await submitEmotionalReflection(mood, reflectionText);
            
            set({ 
                feedback: response.feedback, 
                isLoading: false,
                lastLogTimestamp: new Date().toISOString()
            });

            // Update global progress
            useProgressStore.getState().incrementMetric('personality', 3);
        } catch (error) {
            set({ 
                isLoading: false, 
                error: 'An unexpected error occurred. Please try again.',
                feedback: "We couldn't reach the coaching AI right now. However, expressing your emotions is a great first step."
            });
        }
    },

    resetModule: () => set({
        mood: null,
        reflectionText: '',
        feedback: null,
        isLoading: false,
        error: null
    })
}));
