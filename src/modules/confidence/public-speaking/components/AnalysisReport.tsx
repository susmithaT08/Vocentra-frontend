"use client";

import React from 'react';
import { useSpeakingStore } from '../store/useSpeakingStore';

export const AnalysisReport: React.FC = () => {
    const { analysis, resetModule } = useSpeakingStore();

    if (!analysis) return null;

    return (
        <div className="w-full space-y-6 animate-fade-in-up">
            
            <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
                <h2 className="text-3xl md:text-4xl font-black mb-4 drop-shadow-md flex items-center justify-center gap-3">
                    <span>🏆</span> Performance Report
                </h2>
                <p className="text-blue-100 max-w-2xl mx-auto text-lg leading-relaxed">{analysis.overallFeedback}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Visual Scores */}
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center space-y-8">
                    <div>
                        <div className="flex justify-between text-sm font-bold mb-2">
                            <span className="text-gray-700 uppercase tracking-widest">Clarity & Articulation</span>
                            <span className="text-blue-600">{analysis.clarityScore}/100</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                            <div className="bg-blue-600 h-3 rounded-full transition-all duration-1000 w-0" style={{ width: `${analysis.clarityScore}%` }}></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-sm font-bold mb-2">
                            <span className="text-gray-700 uppercase tracking-widest">Fluency & Flow</span>
                            <span className="text-emerald-500">{analysis.fluencyScore}/100</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                            <div className="bg-emerald-500 h-3 rounded-full transition-all duration-1000 w-0" style={{ width: `${analysis.fluencyScore}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Technical Output */}
                <div className="grid grid-rows-2 gap-6">
                    <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm flex items-center justify-between">
                        <div>
                            <span className="text-xs font-black text-amber-500 uppercase tracking-wider block mb-1">Speaking Speed</span>
                            <h3 className="text-3xl font-black text-amber-900">{analysis.speakingSpeedWPM} <span className="text-sm font-bold">WPM</span></h3>
                        </div>
                        <div className="text-right max-w-[150px]">
                            <p className="text-xs text-amber-800 font-medium leading-relaxed">{analysis.pacingFeedback}</p>
                        </div>
                    </div>
                    
                    <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 shadow-sm flex items-center justify-between">
                        <div>
                            <span className="text-xs font-black text-rose-500 uppercase tracking-wider block mb-1">Filler Words</span>
                            <h3 className="text-3xl font-black text-rose-900">{analysis.fillerWordsCount}</h3>
                        </div>
                        <div className="text-right max-w-[150px]">
                            <p className="text-xs text-rose-800 font-medium leading-relaxed">
                                {analysis.fillerWordsCount > 5 ? 'Try pausing silently instead of using fillers.' : 'Excellent filler control!'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center pt-8">
                <button 
                    onClick={resetModule}
                    className="px-8 py-4 rounded-xl text-blue-600 font-bold bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors shadow-sm"
                >
                    Try Another Topic
                </button>
            </div>
        </div>
    );
};
