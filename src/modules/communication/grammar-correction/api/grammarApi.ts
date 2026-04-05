/**
 * Strictly isolated API interaction for the Grammar Correction module.
 */
import { apiUrl } from '@/lib/api';

export interface CorrectionTarget {
    original: string;
    replacement: string;
    explanation: string;
}

export interface GrammarAnalysisResponse {
    corrections: CorrectionTarget[];
    rewrittenSentence: string;
    tone: string;
    overallFeedback: string;
}

export type CorrectionMode = 'basic' | 'intermediate' | 'advanced';

export const submitGrammarCheck = async (
    text: string,
    correctionMode: CorrectionMode
): Promise<GrammarAnalysisResponse> => {
    try {
        const response = await fetch(apiUrl('/api/grammar-check'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text, correctionMode })
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Return highly structured response avoiding UI crashes
        return {
            corrections: Array.isArray(data?.corrections) ? data.corrections : [],
            rewrittenSentence: data?.rewrittenSentence || text,
            tone: data?.tone || "Neutral",
            overallFeedback: data?.overallFeedback || "Well drafted."
        };
    } catch (error) {
        console.error("Grammar API Error:", error);
        return {
            corrections: [],
            rewrittenSentence: text,
            tone: "Unknown",
            overallFeedback: "Failed to connect to the grammar engine. Please try again later."
        };
    }
};
