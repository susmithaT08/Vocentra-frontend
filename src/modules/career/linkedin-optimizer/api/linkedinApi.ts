import axios from 'axios';
import { LinkedinAnalysis } from '../store/useLinkedinStore';

interface AnalyzeParams {
    profileUrl?: string;
    manualData?: {
        headline: string;
        about: string;
        experience: string;
        skills: string;
    };
}

export const analyzeProfileApi = async (params: AnalyzeParams): Promise<{ analysisResult: LinkedinAnalysis }> => {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
        
        const response = await axios.post(`${BASE_URL}/api/linkedin/analyze`, params, {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        });

        return { analysisResult: response.data.analysisResult };
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            const err = new Error("Session expired. Please return to the Career dashboard and use Quick Login again.");
            (err as any).isUnauthorized = true;
            throw err;
        }
        if (error.response && error.response.status === 422) {
            // This is our specific "scraper blocked" signal
            const err = new Error(error.response.data.message || "Manual input required");
            (err as any).requiresManualInput = true;
            throw err;
        }
        
        throw new Error(error.response?.data?.message || "Profile analysis failed. Please try again later.");
    }
};
