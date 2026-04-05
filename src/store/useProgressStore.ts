import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface ProgressMetrics {
    communication: number;
    personality: number;
    career: number;
    confidence: number;
    vocabulary: number;
}

interface ProgressState {
    metrics: ProgressMetrics;
    isInitialized: boolean;
    insights: string[];
    suggestions: string[];
    strengths: string[];
    weaknesses: string[];
    trend: Record<string, string>;
    isAnalyzing: boolean;
    updateMetric: (key: keyof ProgressMetrics, value: number, meta?: any) => void;
    incrementMetric: (key: keyof ProgressMetrics, amount: number, meta?: any) => void;
    initProgress: () => Promise<void>;
    analyzePerformance: () => Promise<void>;
}

// Custom debounce logic per module to avoid thrashing backend
const debounceTimeouts: Record<string, NodeJS.Timeout> = {};

const syncToBackend = (module: keyof ProgressMetrics, progress: number, meta: any = {}) => {
    if (debounceTimeouts[module]) {
        clearTimeout(debounceTimeouts[module]);
    }

    debounceTimeouts[module] = setTimeout(async () => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (!token) return;

            const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
            await axios.post(
                `${BASE_URL}/api/progress`,
                { module, progress, activityMeta: meta },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            );
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            }
            console.error(`Error syncing progress for ${module}:`, error);
        }
    }, 1500); // 1.5s debounce
};

export const useProgressStore = create<ProgressState>()(
    persist(
        (set, get) => ({
            metrics: {
                communication: 72,
                personality: 65,
                career: 58,
                confidence: 70,
                vocabulary: 0
            },
            isInitialized: false,
            insights: [],
            suggestions: [],
            strengths: [],
            weaknesses: [],
            trend: {},
            isAnalyzing: false,
            
            updateMetric: (key, value, meta) => {
                const newValue = Math.min(100, Math.max(0, value));
                set((state) => ({
                    metrics: { ...state.metrics, [key]: newValue }
                }));
                // Fire and forget syncing
                syncToBackend(key, newValue, meta);
            },
            
            incrementMetric: (key, amount, meta) => {
                const currentState = get();
                const newValue = Math.min(100, currentState.metrics[key] + amount);
                set((state) => ({
                    metrics: { ...state.metrics, [key]: newValue }
                }));
                syncToBackend(key, newValue, meta);
            },

            initProgress: async () => {
                const state = get();
                if (state.isInitialized) return; // Only fetch on fresh load

                try {
                    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                    if (!token) return;

                    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
                    const response = await axios.get(`${BASE_URL}/api/progress`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    // response.data is an object with { [moduleName]: { progress, ... }}
                    if (response.data && typeof response.data === 'object' && Object.keys(response.data).length > 0) {
                        const newMetrics: any = { ...state.metrics };
                        Object.keys(response.data).forEach(module => {
                            if (module in newMetrics) {
                                newMetrics[module] = response.data[module].progress;
                            }
                        });

                        set({ metrics: newMetrics, isInitialized: true });
                    } else {
                        set({ isInitialized: true });
                    }

                } catch (error) {
                    if (axios.isAxiosError(error) && error.response?.status === 401) {
                        if (typeof window !== 'undefined') {
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                        }
                    }
                    console.error('Failed to initialize progress from server', error);
                }
            },
            
            analyzePerformance: async () => {
                set({ isAnalyzing: true });
                try {
                    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                    if (!token) return;

                    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
                    const response = await axios.get(`${BASE_URL}/api/progress/analyze`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (response.data) {
                        const { scores, insights, suggestions, strengths, weaknesses, trend } = response.data;
                        
                        set((state) => ({
                            insights: insights || [],
                            suggestions: suggestions || [],
                            strengths: strengths || [],
                            weaknesses: weaknesses || [],
                            trend: trend || {}
                        }));
                    }
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response?.status === 401) {
                        if (typeof window !== 'undefined') {
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                        }
                    }
                    console.error('Failed to analyze performance:', error);
                } finally {
                    set({ isAnalyzing: false });
                }
            }
        }),
        {
            name: 'vocentra-progress-storage'
        }
    )
);
