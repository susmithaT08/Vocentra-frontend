/**
 * Strictly isolated API interaction for the Conversation Practice module.
 */
import { apiUrl } from '@/lib/api';

export interface ChatMessage {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
}

export interface ConversationMetrics {
    grammar: number;
    fluency: number;
    relevance: number;
    confidence: number;
}

export interface ConversationAIResponse {
    aiReply: string;
    metrics: ConversationMetrics;
    coachingSuggestion: string;
}

export const submitConversationTurn = async (
    messageHistory: ChatMessage[],
    scenario: string,
    difficulty: string,
    aiPersonality: string
): Promise<ConversationAIResponse> => {
    try {
        const response = await fetch(apiUrl('/api/conversation-chat'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messageHistory, scenario, difficulty, aiPersonality })
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Return highly structured response avoiding UI crashes
        return {
            aiReply: data?.aiReply || "Interesting. Go on.",
            metrics: {
                grammar: data?.metrics?.grammar ?? 85,
                fluency: data?.metrics?.fluency ?? 85,
                relevance: data?.metrics?.relevance ?? 85,
                confidence: data?.metrics?.confidence ?? 85
            },
            coachingSuggestion: data?.coachingSuggestion || "Keep maintaining the flow of the conversation."
        };
    } catch (error) {
        console.error("Conversation API Error:", error);
        return {
            aiReply: "I seem to have lost connection momentarily. Please continue what you were saying.",
            metrics: { grammar: 80, fluency: 80, relevance: 80, confidence: 80 },
            coachingSuggestion: "Network issue detected. Metrics are locked in offline mode."
        };
    }
};
