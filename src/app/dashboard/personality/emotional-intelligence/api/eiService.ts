import axios from 'axios';

// Ensure the baseUrl aligns with the Next.js or backend proxy
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

const eiApiClient = axios.create({
    baseURL: `${BASE_URL}/api/ei`,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Since Vocentra likely uses tokens for authentication, attach the auth header
eiApiClient.interceptors.request.use((config) => {
    // Determine token retrieval method based on standard Vocentra architecture
    // Often it's in localStorage for standard React apps
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export const eiService = {
    /**
     * Submit user's mood and reflection.
     * @param {string} mood - Selected mood.
     * @param {string} reflection - The reflective text.
     * @returns {Promise<any>} The AI feedback data.
     */
    submitReflection: async (mood: string, reflection: string) => {
        const response = await eiApiClient.post('/reflect', { mood, reflection });
        return response.data;
    },

    /**
     * Fetch user's entire EI history.
     * @returns {Promise<any[]>} Array of historical reflections.
     */
    getHistory: async () => {
        const response = await eiApiClient.get('/history');
        return response.data;
    }
};
