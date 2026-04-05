/**
 * Strictly isolated API interaction for the Mindset Shifts module.
 */
import { apiUrl } from '@/lib/api';

export interface MindsetReframeResponse {
    reframedThought: string;
    dailyAffirmation: string;
    suggestedHabits: string[];
}

export const submitMindsetReframe = async (
    limitingBelief: string
): Promise<MindsetReframeResponse> => {
    try {
        const response = await fetch(apiUrl('/api/mindset-reframe'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ limitingBelief })
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Return highly structured response avoiding UI crashes
        return {
            reframedThought: data?.reframedThought || "I am capable of overcoming this obstacle.",
            dailyAffirmation: data?.dailyAffirmation || "I choose to grow through what I go through.",
            suggestedHabits: Array.isArray(data?.suggestedHabits) && data.suggestedHabits.length > 0 
                ? data.suggestedHabits 
                : ["Take a deep breath.", "Write down one positive thought.", "Acknowledge my effort."]
        };
    } catch (error) {
        console.error("Mindset API Error:", error);
        return {
            reframedThought: "My perspective determines my reality, and I choose empowerment.",
            dailyAffirmation: "I am resilient even when offline.",
            suggestedHabits: ["Drink a glass of water.", "Stretch for 1 minute.", "Close eyes and visualize success."]
        };
    }
};
