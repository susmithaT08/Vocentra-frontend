"use client";

import React from 'react';
import { useSocialStore } from '../store/useSocialStore';

export const FeedbackEngine: React.FC = () => {
    const { latestMetrics, latestSuggestion, activeScenario, resetModule } = useSocialStore();

    if (!activeScenario || !latestMetrics) return null;

    const metricsList = [
        { label: 'Clarity', score: latestMetrics.clarity, color: 'bg-blue-500' },
        { label: 'Relevance', score: latestMetrics.relevance, color: 'bg-green-500' },
        { label: 'Tone', score: latestMetrics.tone, color: 'bg-purple-500' },
        { label: 'Confidence', score: latestMetrics.confidence, color: 'bg-amber-500' }
    ];

    return (
        <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6 animate-fade-in-up">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>⚡</span> Real-time Analysis
            </h4>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {metricsList.map((m) => (
                    <div key={m.label} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-semibold text-gray-500 uppercase">{m.label}</span>
                            <span className="font-black text-gray-800">{m.score}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div className={`${m.color} h-1.5 rounded-full transition-all duration-700`} style={{ width: `${m.score}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>

            {latestSuggestion && (
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex gap-3 items-start">
                    <span className="text-indigo-500 text-xl">💡</span>
                    <p className="text-indigo-900 text-sm font-medium leading-relaxed pt-0.5">
                        <span className="font-bold block mb-1">AI Suggestion:</span>
                        {latestSuggestion}
                    </p>
                </div>
            )}

            <div className="flex justify-end pt-6 mt-6 border-t border-gray-100">
                <button 
                    onClick={resetModule}
                    className="text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors px-4 py-2"
                >
                    End Scenario
                </button>
            </div>
        </div>
    );
};
