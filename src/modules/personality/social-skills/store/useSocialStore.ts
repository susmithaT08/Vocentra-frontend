import { create } from 'zustand';
import { submitSocialChat, SocialChatResponse, ChatMessage, SocialMetrics } from '../api/socialApi';

export type ScenarioType = 'Networking' | 'Small Talk' | 'Interviews' | null;

interface SocialState {
    // Engine State
    activeScenario: ScenarioType;
    chatHistory: ChatMessage[];
    currentUserInput: string;
    
    // Feedback Engine
    latestMetrics: SocialMetrics | null;
    latestSuggestion: string | null;
    
    isLoading: boolean;
    error: string | null;

    // Actions
    setScenario: (scenario: ScenarioType) => void;
    setUserInput: (text: string) => void;
    sendMessage: () => Promise<void>;
    resetModule: () => void;
}

export const useSocialStore = create<SocialState>((set, get) => ({
    activeScenario: null,
    chatHistory: [],
    currentUserInput: '',
    
    latestMetrics: null,
    latestSuggestion: null,

    isLoading: false,
    error: null,

    setScenario: (scenario) => set({ 
        activeScenario: scenario, 
        chatHistory: [],
        currentUserInput: '',
        latestMetrics: null,
        latestSuggestion: null,
        error: null
    }),

    setUserInput: (text) => set({ currentUserInput: text, error: null }),

    sendMessage: async () => {
        const { activeScenario, currentUserInput, chatHistory } = get();
        
        if (!activeScenario) {
            set({ error: 'Please select a scenario first.' });
            return;
        }
        if (!currentUserInput.trim()) {
            set({ error: 'Message cannot be empty.' });
            return;
        }

        // Add user message to immediate history for UI optimistically
        const updatedHistory = [...chatHistory, { role: 'user', content: currentUserInput } as ChatMessage];
        
        set({ 
            chatHistory: updatedHistory,
            currentUserInput: '', 
            isLoading: true, 
            error: null 
        });

        try {
            const response = await submitSocialChat(activeScenario, chatHistory, currentUserInput);
            set((state) => ({ 
                chatHistory: [...state.chatHistory, { role: 'ai', content: response.aiReply }],
                latestMetrics: response.metrics,
                latestSuggestion: response.suggestion,
                isLoading: false
            }));

            // Sync progress
            import('@/store/useProgressStore').then(module => {
                module.useProgressStore.getState().incrementMetric('personality', 2, { action: 'social_chat', scenario: activeScenario });
                module.useProgressStore.getState().incrementMetric('communication', 1, { action: 'social_chat' });
            });
            
        } catch (error) {
            set({ 
                isLoading: false, 
                error: 'An unexpected error occurred communicating with the AI partner.'
            });
        }
    },

    resetModule: () => set({
        activeScenario: null,
        chatHistory: [],
        currentUserInput: '',
        latestMetrics: null,
        latestSuggestion: null,
        isLoading: false,
        error: null
    })
}));
