import { create } from 'zustand';
import { submitConversationTurn, ConversationAIResponse, ConversationMetrics, ChatMessage } from '../api/conversationApi';

export type SessionState = 'config' | 'active' | 'finished';

interface ConversationStoreState {
    // Config State
    sessionState: SessionState;
    scenario: string;
    difficulty: string;
    aiPersonality: string;
    durationMinutes: number;
    
    // Active State
    messages: ChatMessage[];
    isTyping: boolean;
    latestMetrics: ConversationMetrics | null;
    latestCoaching: string | null;

    // Actions
    setConfig: (scenario: string, difficulty: string, personality: string, duration: number) => void;
    startSession: () => void;
    endSession: () => void;
    sendMessage: (content: string) => Promise<void>;
    resetModule: () => void;
}

export const useConversationStore = create<ConversationStoreState>((set, get) => ({
    sessionState: 'config',
    scenario: 'Job Interview',
    difficulty: 'Medium',
    aiPersonality: 'Professional',
    durationMinutes: 5,
    
    messages: [],
    isTyping: false,
    latestMetrics: null,
    latestCoaching: null,

    setConfig: (scenario, difficulty, aiPersonality, durationMinutes) => {
        set({ scenario, difficulty, aiPersonality, durationMinutes });
    },

    startSession: () => {
        set({ 
            sessionState: 'active', 
            messages: [{
                id: 'init-ai',
                role: 'ai',
                content: `Welcome to the ${get().scenario} simulation. I'll be your conversational partner. Whenever you're ready, say hello!`,
                timestamp: new Date()
            }],
            latestMetrics: { grammar: 100, fluency: 100, relevance: 100, confidence: 100 },
            latestCoaching: "Focus on clear, confident articulation to begin."
        });
    },

    endSession: () => set({ sessionState: 'finished' }),

    sendMessage: async (content: string) => {
        if (!content.trim()) return;

        const newUserMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: new Date()
        };

        const currentMessages = [...get().messages, newUserMsg];
        
        set({ 
            messages: currentMessages,
            isTyping: true 
        });

        try {
            const { scenario, difficulty, aiPersonality } = get();
            
            // Only send the last 10 messages to save context limits
            const historyWindow = currentMessages.slice(-10);
            
            const response = await submitConversationTurn(historyWindow, scenario, difficulty, aiPersonality);
            
            const newAiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: response.aiReply,
                timestamp: new Date()
            };

            set((state) => ({ 
                messages: [...state.messages, newAiMsg],
                latestMetrics: response.metrics,
                latestCoaching: response.coachingSuggestion,
                isTyping: false
            }));
        } catch (error) {
            // Revert typing state if failed horribly (though api client catches errors)
            set({ isTyping: false });
        }
    },

    resetSession: () => set({
        messages: [],
        isTyping: false,
        latestMetrics: null,
        latestCoaching: null
    }),

    resetModule: () => set({
        sessionState: 'config',
        messages: [],
        isTyping: false,
        latestMetrics: null,
        latestCoaching: null
    })
}));
