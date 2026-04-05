/**
 * Strictly isolated API interaction for the Vocabulary Builder module.
 */
import { apiUrl } from '@/lib/api';

export interface VocabWord {
    word: string;
    phonetics: string;
    definition: string;
    synonyms: string[];
    example: string;
}

export const generateVocabWords = async (
    category: string
): Promise<VocabWord[]> => {
    try {
        const response = await fetch(apiUrl('/api/vocabulary/words'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ category })
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data?.words && Array.isArray(data.words)) {
            return data.words;
        }

        throw new Error("Invalid response format");
        
    } catch (error) {
        console.error("Vocab API Error:", error);
        // Fallback words if the server is offline or fails
        return [
            {
                word: "resilient",
                phonetics: "/rɪˈzɪliənt/",
                definition: "Able to withstand or recover quickly from difficult conditions.",
                synonyms: ["strong", "tough", "hardy"],
                example: "The resilient startup survived the economic downturn and eventually thrived."
            },
            {
                word: "mitigate",
                phonetics: "/ˈmɪtɪˌɡeɪt/",
                definition: "Make less severe, serious, or painful.",
                synonyms: ["alleviate", "reduce", "diminish"],
                example: "We implemented new security protocols to mitigate the risk of data breaches."
            },
            {
                word: "innovative",
                phonetics: "/ˈɪnəˌveɪtɪv/",
                definition: "Featuring new methods; advanced and original.",
                synonyms: ["original", "new", "novel"],
                example: "Her innovative design approach completely revolutionized the application's interface."
            }
        ];
    }
};
