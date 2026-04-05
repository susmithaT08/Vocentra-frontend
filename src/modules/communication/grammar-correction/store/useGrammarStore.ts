import { create } from 'zustand';
import { submitGrammarCheck, GrammarAnalysisResponse, CorrectionMode, CorrectionTarget } from '../api/grammarApi';

interface GrammarState {
    // Engine State
    rawText: string;
    correctionMode: CorrectionMode;
    
    // Output State
    latestAnalysis: GrammarAnalysisResponse | null;
    isAnalyzing: boolean;
    error: string | null;

    // Actions
    setText: (text: string) => void;
    setMode: (mode: CorrectionMode) => void;
    triggerAnalysis: () => Promise<void>;
    applyCorrection: (original: string, replacement: string) => void;
    applyFullRewrite: () => void;
    resetModule: () => void;
}

export const useGrammarStore = create<GrammarState>((set, get) => ({
    rawText: '',
    correctionMode: 'intermediate',
    
    latestAnalysis: null,
    isAnalyzing: false,
    error: null,

    setText: (text) => set({ rawText: text, error: null }),
    
    setMode: (mode) => {
        set({ correctionMode: mode });
        // Optionally trigger re-analysis if text isn't empty
        if (get().rawText.trim().length > 5 && !get().isAnalyzing) {
            get().triggerAnalysis();
        }
    },

    triggerAnalysis: async () => {
        const { rawText, correctionMode } = get();

        if (rawText.trim().length === 0) {
            set({ latestAnalysis: null, error: null });
            return;
        }

        set({ isAnalyzing: true, error: null });

        try {
            const response = await submitGrammarCheck(rawText, correctionMode);
            
            set({ 
                latestAnalysis: response,
                isAnalyzing: false
            });
        } catch (error) {
            set({ 
                isAnalyzing: false, 
                error: 'An unexpected error occurred building your profile.'
            });
        }
    },

    applyCorrection: (original, replacement) => {
        const { rawText, latestAnalysis } = get();
        
        // Simple string replace for the first occurrence of the target text
        const newText = rawText.replace(original, replacement);
        
        // Optimistically remove the correction from the UI list as well
        let newAnalysis = latestAnalysis;
        if (latestAnalysis) {
            newAnalysis = {
                ...latestAnalysis,
                corrections: latestAnalysis.corrections.filter(c => c.original !== original)
            };
        }

        set({ rawText: newText, latestAnalysis: newAnalysis });
        // Since the text changed, we might trigger analysis again, or wait for debounce.
    },

    applyFullRewrite: () => {
        const { latestAnalysis } = get();
        if (latestAnalysis && latestAnalysis.rewrittenSentence) {
            set({ rawText: latestAnalysis.rewrittenSentence });
        }
    },

    resetModule: () => set({
        rawText: '',
        correctionMode: 'intermediate',
        latestAnalysis: null,
        isAnalyzing: false,
        error: null
    })
}));
