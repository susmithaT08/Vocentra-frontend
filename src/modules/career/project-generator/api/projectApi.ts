import axios from 'axios';
import { GeneratedProject } from '../store/useProjectGeneratorStore';

export interface GenerateProjectParams {
    branch: string;
    level: string;
    domain: string;
    languages: string[];
}

export const generateProjectsApi = async (params: GenerateProjectParams): Promise<GeneratedProject[]> => {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
        
        const response = await axios.post(`${BASE_URL}/api/project-generator/generate`, params, {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        });

        if (response.data && response.data.projects) {
            return response.data.projects;
        }
        
        return [];
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            const err = new Error("Session expired. Please return to the Career dashboard and use Quick Login again.");
            (err as any).isUnauthorized = true;
            throw err;
        }
        console.error("Failed to generate projects:", error);
        throw new Error("Failed to generate project ideas. Please try again.");
    }
};
