/**
 * Strictly isolated API interaction for the Public Speaking module.
 */
import { apiUrl } from '@/lib/api';

export interface SpeechAnalysisResponse {
    clarityScore: number;
    fluencyScore: number;
    speakingSpeedWPM: number;
    fillerWordsCount: number;
    pacingFeedback: string;
    overallFeedback: string;
}

export const submitSpeechAnalysis = async (
    topic: string,
    transcript: string,
    durationSeconds: number
): Promise<SpeechAnalysisResponse> => {
    try {
        const response = await fetch(apiUrl('/api/speech-analysis'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ topic, transcript, durationSeconds })
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Return highly structured response avoiding UI crashes
        return {
            clarityScore: data?.clarityScore ?? 80,
            fluencyScore: data?.fluencyScore ?? 80,
            speakingSpeedWPM: data?.speakingSpeedWPM ?? 120,
            fillerWordsCount: data?.fillerWordsCount ?? 0,
            pacingFeedback: data?.pacingFeedback || "Your pacing seems stable.",
            overallFeedback: data?.overallFeedback || "Keep practicing your public speaking!"
        };
    } catch (error) {
        console.error("Speaking API Error:", error);
        return {
            clarityScore: 70,
            fluencyScore: 70,
            speakingSpeedWPM: 100,
            fillerWordsCount: 5,
            pacingFeedback: "Offline mode: Unverified due to connection errors.",
            overallFeedback: "We could not reach the AI analyzer. Please check your connection and try again."
        };
    }
};
