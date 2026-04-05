"use client";

import React from 'react';
import { useGrammarStore } from '../store/useGrammarStore';

export const CorrectionCards: React.FC = () => {
    const { latestAnalysis, applyCorrection, applyFullRewrite, rawText } = useGrammarStore();

    if (!rawText.trim() && !latestAnalysis) {
        return (
            <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-gray-50/50 p-6 md:p-8 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium text-center">Your personalized grammar suggestions and improvements will appear here.</p>
            </div>
        );
    }

    if (!latestAnalysis) return null;

    return (
        <div className="w-full h-[500px] flex flex-col animate-fade-in-up">
            
            {/* Tone Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4 flex items-center justify-between">
                <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Detected Tone</span>
                    <span className="font-black text-indigo-900 text-lg">{latestAnalysis.tone}</span>
                </div>
                <div className="bg-indigo-50 w-12 h-12 rounded-full flex items-center justify-center text-xl border border-indigo-100 shadow-sm">
                    {latestAnalysis.tone.toLowerCase().includes('professional') || latestAnalysis.tone.toLowerCase().includes('assertive') ? '💼' 
                    : latestAnalysis.tone.toLowerCase().includes('anxious') ? '😟' 
                    : '💬'}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar pb-4">
                {/* Specific Corrections */}
                {latestAnalysis.corrections.length > 0 ? (
                    latestAnalysis.corrections.map((correction, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-xl border border-rose-100 shadow-sm hover:shadow transition-shadow">
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-sm font-bold text-rose-500 line-through bg-rose-50 px-2 py-1 rounded">{correction.original}</span>
                                        <span className="text-gray-400">➔</span>
                                        <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">{correction.replacement}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed font-medium">{correction.explanation}</p>
                                </div>
                            </div>
                            <div className="flex justify-end pt-3 border-t border-gray-50 mt-2">
                                <button 
                                    onClick={() => applyCorrection(correction.original, correction.replacement)}
                                    className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
                                >
                                    Apply Fix
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 flex items-center justify-center">
                        <span className="text-emerald-700 font-bold flex items-center gap-2">
                            <span>✅</span> No grammatical errors spotted!
                        </span>
                    </div>
                )}

                {/* Full Rewrite Suggestion */}
                {latestAnalysis.rewrittenSentence && latestAnalysis.rewrittenSentence !== rawText && (
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-xl border border-indigo-100 shadow-sm mt-6">
                        <span className="text-xs font-black text-indigo-400 uppercase tracking-wider block mb-3">Suggested Polish</span>
                        <p className="text-indigo-900 font-medium leading-relaxed italic mb-4 text-sm bg-white p-3 rounded-lg border border-indigo-50 shadow-inner">
                            "{latestAnalysis.rewrittenSentence}"
                        </p>
                        <button 
                            onClick={applyFullRewrite}
                            className="w-full text-sm font-bold text-indigo-700 bg-white border-2 border-indigo-200 hover:border-indigo-400 px-4 py-2.5 rounded-lg transition-colors shadow-sm"
                        >
                            Apply Full Rewrite
                        </button>
                    </div>
                )}
            </div>
            
            <div className="mt-auto bg-gray-50 border border-gray-200 p-4 rounded-xl text-xs text-gray-500 font-medium">
                {latestAnalysis.overallFeedback}
            </div>
        </div>
    );
};
