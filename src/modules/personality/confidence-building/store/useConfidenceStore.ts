import { create } from 'zustand';
import { submitAudioForAnalysis, ConfidenceAnalysisResponse } from '../api/confidenceApi';
import { useProgressStore } from '@/store/useProgressStore';

interface ConfidenceState {
    // Engine State
    dailyStreak: number;
    sessionsCompleted: number;
    averageScore: number | null;
    currentDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';

    // Practice State
    isRecording: boolean;
    practiceTimeRemaining: number;
    recordingTranscript: string;
    
    // Feedback State
    latestAnalysis: ConfidenceAnalysisResponse | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    setDifficulty: (level: 'Beginner' | 'Intermediate' | 'Advanced') => void;
    startPractice: () => void;
    stopPractice: () => void;
    setTranscript: (text: string) => void;
    decrementTimer: () => void;
    submitPracticeSession: () => Promise<void>;
    resetPractice: () => void;
}

export const useConfidenceStore = create<ConfidenceState>((set, get) => ({
    dailyStreak: 3, // Mock starting streak
    sessionsCompleted: 12,
    averageScore: 74,
    currentDifficulty: 'Beginner',

    isRecording: false,
    practiceTimeRemaining: 60,
    recordingTranscript: '',

    latestAnalysis: null,
    isLoading: false,
    error: null,

    setDifficulty: (level) => set({ currentDifficulty: level }),

    startPractice: () => set({ 
        isRecording: true, 
        practiceTimeRemaining: 60, 
        recordingTranscript: '',
        latestAnalysis: null,
        error: null
    }),

    stopPractice: () => set({ isRecording: false }),

    setTranscript: (text) => set({ recordingTranscript: text }),

    decrementTimer: () => {
        const { practiceTimeRemaining, isRecording, stopPractice } = get();
        if (isRecording && practiceTimeRemaining > 0) {
            set({ practiceTimeRemaining: practiceTimeRemaining - 1 });
        } else if (practiceTimeRemaining === 0 && isRecording) {
            stopPractice();
        }
    },

    submitPracticeSession: async () => {
        const { recordingTranscript } = get();
        
        // Strict local validation
        if (!recordingTranscript.trim()) {
            set({ error: 'Please record or type some text before submitting.' });
            return;
        }

        set({ isLoading: true, error: null, isRecording: false });

        try {
            const duration = 60 - get().practiceTimeRemaining;
            const response = await submitAudioForAnalysis(recordingTranscript, duration);
            
            // Engine updates
            const previousScore = get().averageScore || 0;
            const newAverage = previousScore === 0 ? response.score : Math.round((previousScore + response.score) / 2);

            set((state) => ({ 
                latestAnalysis: response, 
                isLoading: false,
                sessionsCompleted: state.sessionsCompleted + 1,
                averageScore: newAverage
            }));

            // Update global progress
            useProgressStore.getState().incrementMetric('confidence', 2);
        } catch (error) {
            set({ 
                isLoading: false, 
                error: 'An unexpected error occurred processing your practice.'
            });
        }
    },

    resetPractice: () => set({
        isRecording: false,
        practiceTimeRemaining: 60,
        recordingTranscript: '',
        latestAnalysis: null,
        error: null
    })
}));
