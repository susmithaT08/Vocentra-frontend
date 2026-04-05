import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GeneratedProject {
    id: string;
    title: string;
    problemStatement: string;
    keyFeatures: string[];
    techStack: string[];
    difficulty: {
        level: string;
        justification: string;
    };
    resumeWeightage: {
        score: number;
        reasoning: string;
    };
    placementWeightage: {
        level: "Low" | "Medium" | "High";
        explanation: string;
    };
}

export interface ProjectGeneratorState {
    projects: GeneratedProject[];
    startedProjects: Record<string, boolean>;
    completedProjects: Record<string, boolean>;
    isLoading: boolean;
    error: string | null;
    isUnauthorized: boolean;
    
    setProjects: (projects: GeneratedProject[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setUnauthorized: (unauthorized: boolean) => void;
    markStarted: (id: string) => void;
    markCompleted: (id: string) => void;
    clearProjects: () => void;
}

export const useProjectGeneratorStore = create<ProjectGeneratorState>()(
    persist(
        (set) => ({
            projects: [],
            startedProjects: {},
            completedProjects: {},
            isLoading: false,
            error: null,
            isUnauthorized: false,

            setProjects: (projects) => set({ projects, error: null, isUnauthorized: false }),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error, isLoading: false }),
            setUnauthorized: (isUnauthorized) => set({ isUnauthorized, isLoading: false }),
            
            markStarted: (id) => set((state) => ({
                startedProjects: { ...state.startedProjects, [id]: true }
            })),
            
            markCompleted: (id) => set((state) => ({
                completedProjects: { ...state.completedProjects, [id]: true }
            })),

            clearProjects: () => set({ projects: [], error: null, isUnauthorized: false })
        }),
        {
            name: 'vocentra-project-generator-storage'
        }
    )
);
