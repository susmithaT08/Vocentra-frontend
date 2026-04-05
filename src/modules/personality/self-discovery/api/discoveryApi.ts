/**
 * Strictly isolated API interaction for the Self-Discovery module.
 */
import { apiUrl } from '@/lib/api';

export interface DiscoveryInsightsResponse {
    archetype: string;
    strengths: string[];
    weaknesses: string[];
    gapSynthesis: string;
}

export type AssessmentAnswers = Record<string, number | string>;

export const submitDiscoveryProfile = async (
    assessmentAnswers: AssessmentAnswers,
    userGoal: string
): Promise<DiscoveryInsightsResponse> => {
    try {
        const response = await fetch(apiUrl('/api/self-discovery-insights'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ assessmentAnswers, userGoal })
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Return highly structured response avoiding UI crashes
        return {
            archetype: data?.archetype || "The Perpetual Learner",
            strengths: Array.isArray(data?.strengths) && data.strengths.length ? data.strengths : ["Adaptability", "Curiosity", "Resilience"],
            weaknesses: Array.isArray(data?.weaknesses) && data.weaknesses.length ? data.weaknesses : ["Over-committing", "Perfectionism"],
            gapSynthesis: data?.gapSynthesis || "Your goal requires focused execution. Balance your immense curiosity with structured deadlines to bridge the gap."
        };
    } catch (error) {
        console.error("Discovery API Error:", error);
        return {
            archetype: "The Grounded Realist",
            strengths: ["Practicality", "Consistency", "Dependability"],
            weaknesses: ["Risk Aversion", "Pessimism"],
            gapSynthesis: "We couldn't connect to the AI engine for a customized analysis, but leveraging your natural consistency will help you achieve your goals step-by-step."
        };
    }
};
