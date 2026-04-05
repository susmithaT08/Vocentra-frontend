/**
 * Strictly isolated API interaction for the Social Skills module.
 */
import { apiUrl } from '@/lib/api';

export interface SocialMetrics {
    clarity: number;
    relevance: number;
    tone: number;
    confidence: number;
}

export interface SocialChatResponse {
    aiReply: string;
    metrics: SocialMetrics;
    suggestion: string;
}

export interface ChatMessage {
    role: 'user' | 'ai';
    content: string;
}

export const submitSocialChat = async (
    scenario: string,
    chatHistory: ChatMessage[],
    userMessage: string
): Promise<SocialChatResponse> => {
    try {
        const response = await fetch(apiUrl('/api/social-chat'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ scenario, chatHistory, userMessage })
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Return highly structured response
        return {
            aiReply: data?.aiReply || "I understand. Let's redirect our conversation. Tell me a bit more.",
            metrics: {
                clarity: data?.metrics?.clarity ?? 70,
                relevance: data?.metrics?.relevance ?? 70,
                tone: data?.metrics?.tone ?? 75,
                confidence: data?.metrics?.confidence ?? 65
            },
            suggestion: data?.suggestion || "Maintain active listening cues and offer brief, affirming statements."
        };
    } catch (error) {
        console.error("Social API Error:", error);
        return {
            aiReply: "It seems we dropped the connection, but you handled that pause gracefully! What were you saying?",
            metrics: { clarity: 60, relevance: 60, tone: 70, confidence: 60 },
            suggestion: "When facing a technical hiccup, stay calm and redirect the flow seamlessly."
        };
    }
};
