import { create } from 'zustand';
import { submitMindsetReframe, MindsetReframeResponse } from '../api/mindsetApi';

export interface TrackedBelief {
    id: string;
    limitingBelief: string;
    reframedThought: string;
    timestamp: Date;
}

export interface TrackedHabit {
    id: string;
    title: string;
    streak: number;
    completedToday: boolean;
}

interface MindsetStoreState {
    // Input State
    limitingBeliefInput: string;
    isAnalyzing: boolean;
    error: string | null;

    // Active Session Output
    currentReframe: MindsetReframeResponse | null;

    // Historical State (Simulated Persistence)
    beliefHistory: TrackedBelief[];
    activeHabits: TrackedHabit[];

    // Actions
    setBeliefInput: (val: string) => void;
    processBelief: () => Promise<void>;
    toggleHabit: (id: string) => void;
    clearCurrent: () => void;
}

export const useMindsetStore = create<MindsetStoreState>((set, get) => ({
    limitingBeliefInput: '',
    isAnalyzing: false,
    error: null,
    
    currentReframe: null,
    
    // Default simulated history to populate the dashboard immediately
    beliefHistory: [
        {
            id: '1',
            limitingBelief: "I'm not experienced enough for this role.",
            reframedThought: "Every expert was once a beginner. My unique perspective is valuable.",
            timestamp: new Date(Date.now() - 86400000 * 2) 
        },
        {
            id: '2',
            limitingBelief: "If I make a mistake, they will think I'm a fraud.",
            reframedThought: "Mistakes are proof that I am trying. They are essential data points for growth.",
            timestamp: new Date(Date.now() - 86400000)
        }
    ],

    // Default simulated active habits
    activeHabits: [
        { id: 'h1', title: 'Write down 3 wins', streak: 5, completedToday: false },
        { id: 'h2', title: 'Review positive feedback', streak: 12, completedToday: true }
    ],

    setBeliefInput: (val) => set({ limitingBeliefInput: val }),

    processBelief: async () => {
        const belief = get().limitingBeliefInput.trim();
        if (!belief) return;

        set({ isAnalyzing: true, error: null });

        try {
            const response = await submitMindsetReframe(belief);
            
            const newHistoryItem: TrackedBelief = {
                id: Date.now().toString(),
                limitingBelief: belief,
                reframedThought: response.reframedThought,
                timestamp: new Date()
            };

            const newHabits: TrackedHabit[] = response.suggestedHabits.map((h, i) => ({
                id: `new-hab-${Date.now()}-${i}`,
                title: h,
                streak: 0,
                completedToday: false
            }));

            set((state) => ({
                currentReframe: response,
                beliefHistory: [newHistoryItem, ...state.beliefHistory].slice(0, 10), // Keep last 10
                activeHabits: [...newHabits, ...state.activeHabits].slice(0, 6), // Max 6 habits
                isAnalyzing: false,
                limitingBeliefInput: '' // clear input
            }));

            // Sync progress
            import('@/store/useProgressStore').then(module => {
                module.useProgressStore.getState().incrementMetric('confidence', 3, { action: 'mindset_reframe' });
            });

        } catch (err) {
            set({ isAnalyzing: false, error: 'Failed to process belief. Please try again.' });
        }
    },

    toggleHabit: (id) => {
        set((state) => {
            const updated = state.activeHabits.map(h => {
                if (h.id === id) {
                    if (h.completedToday) {
                        return { ...h, completedToday: false, streak: Math.max(0, h.streak - 1) };
                    } else {
                        return { ...h, completedToday: true, streak: h.streak + 1 };
                    }
                }
                return h;
            });
            return { activeHabits: updated };
        });
    },

    clearCurrent: () => set({ currentReframe: null })
}));
