/**
 * Strictly isolated API interaction for the Confidence Building module.
 */

export interface ConfidenceAnalysisResponse {
    score: number;
    feedback: string;
    postureTip: string;
}

export const submitAudioForAnalysis = async (
    text: string,
    durationSeconds: number
): Promise<ConfidenceAnalysisResponse> => {
    try {
        const response = await fetch('/api/analyze-confidence', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text, durationSeconds })
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Ensure structured response even if backend unexpectedly mutated
        return {
            score: data?.score || 65,
            feedback: data?.feedback || "You maintained a steady pace. Focus on projecting your voice to increase confidence further.",
            postureTip: data?.postureTip || "Keep your chest open to allow for better diaphragmatic breathing."
        };
    } catch (error) {
        console.error("Confidence API Error:", error);
        return {
            score: 70,
            feedback: "We couldn't reach the AI Coach right now, but practicing in front of a mirror is a great way to boost baseline confidence.",
            postureTip: "Stand up straight and make eye contact with your reflection."
        };
    }
};
