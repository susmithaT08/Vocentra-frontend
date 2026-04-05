/**
 * Strictly isolated API interaction for the Emotional Intelligence module.
 * Never imports global stores or affects other files.
 */
import { apiUrl } from '@/lib/api';

export interface EIFeedbackResponse {
    feedback: string;
}

export const submitEmotionalReflection = async (
    mood: string,
    reflection: string
): Promise<EIFeedbackResponse> => {
    try {
        const response = await fetch(apiUrl('/api/emotional-feedback'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mood, reflection })
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Ensure structured response even if backend unexpectedly mutated
        return {
            feedback: data?.feedback || "We couldn't process your reflection right now, but your feelings are valid. Take some time to rest."
        };
    } catch (error) {
        console.error("EI API Error:", error);
        return {
            feedback: "It seems we are having trouble connecting to the AI Coach. However, the act of writing down your feelings is a critical step to emotional awareness."
        };
    }
};
