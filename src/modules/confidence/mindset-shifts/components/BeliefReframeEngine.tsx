"use client";

import React from 'react';
import { useMindsetStore } from '../store/useMindsetStore';

export const BeliefReframeEngine: React.FC = () => {
    const { limitingBeliefInput, setBeliefInput, processBelief, isAnalyzing, currentReframe, error, clearCurrent } = useMindsetStore();

    if (currentReframe) {
        return (
            <div className="w-full bg-gradient-to-br from-yellow-50 to-orange-50 p-8 md:p-12 rounded-3xl shadow-md border border-yellow-100 flex flex-col items-center animate-scale-in text-center relative overflow-hidden">
                <div className="absolute -top-10 -right-10 text-[150px] opacity-5">☀️</div>
                <span className="text-xs font-black text-yellow-600 uppercase tracking-widest block mb-4">Your Reframed Reality</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-orange-900 leading-snug drop-shadow-sm mb-6">
                    "{currentReframe?.reframedThought || 'Your new perspective is ready.'}"
                </h2>
                <div className="bg-white/60 p-5 rounded-2xl w-full max-w-lg mb-8 border border-white shadow-sm backdrop-blur-sm">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Daily Affirmation</span>
                    <p className="text-lg font-bold text-gray-800">✨ {currentReframe?.dailyAffirmation || 'I am growing every day.'} ✨</p>
                </div>
                <button 
                    onClick={clearCurrent}
                    className="text-sm font-bold flex items-center gap-2 text-yellow-700 hover:text-orange-600 transition-colors"
                >
                    <span>🔄</span> Reframe another belief
                </button>
            </div>
        );
    }

    return (
        <div className="w-full bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center animate-fade-in-up text-center">
            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">Cognitive Reframing Engine</h3>
            <p className="text-gray-500 mb-8 max-w-lg">Identify a negative or limiting belief that is currently holding you back, and let the AI transition it into a source of power.</p>
            
            <div className="w-full max-w-2xl space-y-4">
                {error && (
                    <div className="bg-red-50 text-red-600 text-sm font-bold p-3 rounded-lg animate-pulse mb-4">
                        {error}
                    </div>
                )}
                <div className="relative">
                    <textarea 
                        rows={3}
                        value={limitingBeliefInput}
                        onChange={(e) => setBeliefInput(e.target.value)}
                        placeholder="e.g., 'I will never be good enough to pass this technical interview...'"
                        className="w-full p-5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-yellow-400 focus:bg-white transition-colors text-gray-800 placeholder-gray-400 resize-none font-medium"
                        disabled={isAnalyzing}
                    />
                </div>
                <button
                    onClick={processBelief}
                    disabled={isAnalyzing || !limitingBeliefInput.trim()}
                    className={`w-full py-4 font-bold text-lg rounded-xl shadow-lg transition-all flex items-center justify-center gap-3
                        ${isAnalyzing || !limitingBeliefInput.trim() ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'bg-gray-900 hover:bg-black text-white hover:shadow-xl hover:-translate-y-1 active:scale-95'}`}
                >
                    {isAnalyzing ? (
                        <>
                            <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                            Synthesizing...
                        </>
                    ) : (
                        <><span>✨</span> Transform My Mindset</>
                    )}
                </button>
            </div>
        </div>
    );
};
