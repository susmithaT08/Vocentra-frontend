import { create } from 'zustand';
import { generateVocabWords, VocabWord } from '../api/vocabApi';
import { useProgressStore } from '@/store/useProgressStore';

export interface LearningWord extends VocabWord {
    id: string;
    masteryLevel: number; // 0 = New, 1 = Learning, 2 = Reviewing, 3 = Mastered
    nextReviewDate: number; // Timestamp
    category: string;
}

interface VocabStoreState {
    // Learning Data Map
    wordsData: Record<string, LearningWord>;
    
    // UI State
    activeCategory: string;
    isGenerating: boolean;
    error: string | null;

    // View State (learning | quiz | progress)
    currentView: 'learning' | 'quiz' | 'progress';
    
    // Actions
    setCategory: (cat: string) => void;
    setView: (view: 'learning' | 'quiz' | 'progress') => void;
    loadDailyWords: () => Promise<void>;
    
    // Spaced Repetition Engine
    processQuizAnswer: (wordId: string, isCorrect: boolean) => void;
    
    // Selectors logic
    getWordsForToday: () => LearningWord[];
    getWordsByMastery: () => Record<number, number>;
}

export const useVocabStore = create<VocabStoreState>((set, get) => ({
    wordsData: {
        'mock1': {
            id: 'mock1',
            word: 'ubiquitous',
            phonetics: '/juːˈbɪkwɪtəs/',
            definition: 'Present, appearing, or found everywhere.',
            synonyms: ['omnipresent', 'everywhere', 'pervasive'],
            example: 'Smartphones have become ubiquitous in modern society.',
            masteryLevel: 1,
            nextReviewDate: Date.now() - 10000,
            category: 'Daily Conversation'
        },
        'mock2': {
            id: 'mock2',
            word: 'synergy',
            phonetics: '/ˈsɪnərdʒi/',
            definition: 'The interaction or cooperation of two or more organizations, substances, or other agents to produce a combined effect greater than the sum of their separate effects.',
            synonyms: ['collaboration', 'teamwork', 'cooperation'],
            example: 'The synergy between the two departments lead to a highly successful product launch.',
            masteryLevel: 2,
            nextReviewDate: Date.now() - 50000,
            category: 'Interview'
        }
    },
    
    activeCategory: 'Interview',
    isGenerating: false,
    error: null,
    currentView: 'learning',

    setCategory: (cat) => set({ activeCategory: cat }),
    setView: (view) => set({ currentView: view }),

    loadDailyWords: async () => {
        const { activeCategory, wordsData } = get();
        set({ isGenerating: true, error: null });

        try {
            const fetchedWords = await generateVocabWords(activeCategory);
            
            const newWordsRecord = { ...wordsData };
            fetchedWords.forEach((word) => {
                const id = `${word.word.toLowerCase()}-${Date.now()}`;
                newWordsRecord[id] = {
                    ...word,
                    id,
                    masteryLevel: 0,
                    nextReviewDate: Date.now(), // Review immediately
                    category: activeCategory
                };
            });

            set({
                wordsData: newWordsRecord,
                isGenerating: false,
            });
        } catch (err) {
            set({ isGenerating: false, error: 'Failed to load new vocabulary words.' });
        }
    },

    processQuizAnswer: (wordId, isCorrect) => {
        set((state) => {
            const word = state.wordsData[wordId];
            if (!word) return state;

            const newData = { ...state.wordsData };
            let newMastery = word.masteryLevel;
            let nextReviewOffset = 0;

            if (isCorrect) {
                // Leitner Spacing Logic Upgrade
                newMastery = Math.min(3, newMastery + 1);
                
                // 1 = 1 hour, 2 = 1 day, 3 = 3 days 
                // For demonstration, using much shorter intervals: 
                // 1 = 1 min, 2 = 5 mins, 3 = 24 hours
                if (newMastery === 1) nextReviewOffset = 1000 * 60; 
                else if (newMastery === 2) nextReviewOffset = 1000 * 60 * 5;
                else if (newMastery === 3) nextReviewOffset = 1000 * 60 * 60 * 24;
            } else {
                // Incorrect reset
                newMastery = 0;
                nextReviewOffset = 0; // Review immediately
            }

            newData[wordId] = {
                ...word,
                masteryLevel: newMastery,
                nextReviewDate: Date.now() + nextReviewOffset
            };

            if (isCorrect) {
                useProgressStore.getState().incrementMetric('communication', 1);
            }

            return { wordsData: newData };
        });
    },

    getWordsForToday: () => {
        const state = get();
        const now = Date.now();
        return Object.values(state.wordsData)
            .filter(w => w.nextReviewDate <= now)
            .sort((a, b) => a.nextReviewDate - b.nextReviewDate); // Oldest review first
    },

    getWordsByMastery: () => {
        const state = get();
        const counts = { 0: 0, 1: 0, 2: 0, 3: 0 };
        Object.values(state.wordsData).forEach(w => {
            counts[w.masteryLevel as keyof typeof counts]++;
        });
        return counts;
    }
}));
