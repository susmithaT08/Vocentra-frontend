import { create } from 'zustand';
import { submitSpeechAnalysis, SpeechAnalysisResponse } from '../api/speakingApi';

export type SpeakingSessionState = 'topic-selection' | 'recording' | 'analyzing' | 'report';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

interface SpeakingStoreState {
    // Config State
    sessionState: SpeakingSessionState;
    difficulty: Difficulty;
    topic: string;
    
    // Recording State
    isRecording: boolean;
    durationSeconds: number;
    transcript: string; // Simulated or real
    
    // Output State
    analysis: SpeechAnalysisResponse | null;
    error: string | null;

    // Actions
    setDifficulty: (diff: Difficulty) => void;
    generateTopic: () => void;
    startRecording: () => void;
    stopRecording: (finalTranscript: string, finalDuration: number) => void;
    submitRecording: () => Promise<void>;
    resetModule: () => void;
}

const TOPICS = {
    Easy: [
        "What is your favorite hobby and why do you enjoy it?",
        "Describe your perfect weekend getaway.",
        "Talk about a book or movie that recently inspired you."
    ],
    Medium: [
        "Explain a complex project you worked on recently.",
        "How do you handle disagreements in the workplace?",
        "What are the biggest challenges facing remote workers today?"
    ],
    Hard: [
        "Pitch a disruptive startup idea to a panel of investors.",
        "Defend an unpopular opinion you hold regarding technology.",
        "Analyze the impact of artificial intelligence on creative industries."
    ]
};

export const useSpeakingStore = create<SpeakingStoreState>((set, get) => ({
    sessionState: 'topic-selection',
    difficulty: 'Medium',
    topic: "Click 'Generate Topic' to begin.",
    
    isRecording: false,
    durationSeconds: 0,
    transcript: '',
    
    analysis: null,
    error: null,

    setDifficulty: (diff) => {
        set({ difficulty: diff });
        get().generateTopic();
    },

    generateTopic: () => {
        const diff = get().difficulty;
        const available = TOPICS[diff];
        const randomTopic = available[Math.floor(Math.random() * available.length)];
        set({ topic: randomTopic });
    },

    startRecording: () => {
        set({ 
            sessionState: 'recording',
            isRecording: true,
            durationSeconds: 0,
            transcript: ''
        });
    },

    stopRecording: (finalTranscript: string, finalDuration: number) => {
        set({ 
            isRecording: false,
            transcript: finalTranscript,
            durationSeconds: finalDuration
        });
    },

    submitRecording: async () => {
        const { topic, transcript, durationSeconds } = get();

        // Basic validation
        if (transcript.trim().length === 0 && durationSeconds < 2) {
            set({ error: "Recording was too short to analyze." });
            return;
        }

        set({ sessionState: 'analyzing', error: null });

        try {
            const response = await submitSpeechAnalysis(topic, transcript, durationSeconds);
            set({ 
                sessionState: 'report',
                analysis: response 
            });

            // Sync progress
            import('@/store/useProgressStore').then(module => {
                module.useProgressStore.getState().incrementMetric('confidence', 5, { action: 'public_speaking', topic });
                module.useProgressStore.getState().incrementMetric('communication', 3, { action: 'public_speaking_boost' });
            });
            
        } catch (error) {
            set({ 
                sessionState: 'report',
                error: 'An unexpected error occurred building your report.'
            });
        }
    },

    resetModule: () => {
        set({
            sessionState: 'topic-selection',
            isRecording: false,
            durationSeconds: 0,
            transcript: '',
            analysis: null,
            error: null
        });
        get().generateTopic();
    }
}));
