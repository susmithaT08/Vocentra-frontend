"use client";

import React from 'react';
import { useDiscoveryStore } from '../store/useDiscoveryStore';

export const InsightsDashboard: React.FC = () => {
    const { insights, resetModule } = useDiscoveryStore();

    if (!insights) return null;

    return (
        <div className="w-full space-y-6 animate-fade-in-up">
            
            {/* Header / Archetype */}
            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
                <span className="text-indigo-300 font-bold tracking-widest uppercase text-sm mb-4 block">Your Archetype</span>
                <h2 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-md">{insights.archetype}</h2>
                <p className="text-indigo-100 max-w-2xl mx-auto text-lg">Your core operating traits align with this profile, defining how you approach challenges and relationships.</p>
            </div>

            {/* Strengths & Weaknesses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-gray-800">
                        <span className="text-green-500">↑</span> Core Strengths
                    </h3>
                    <ul className="space-y-4">
                        {insights.strengths.map((s, idx) => (
                            <li key={idx} className="flex flex-col bg-green-50/50 p-4 rounded-xl border border-green-100">
                                <span className="font-semibold text-green-900">{s}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-gray-800">
                        <span className="text-red-500">↓</span> Potential Blind Spots
                    </h3>
                    <ul className="space-y-4">
                        {insights.weaknesses.map((w, idx) => (
                            <li key={idx} className="flex flex-col bg-red-50/50 p-4 rounded-xl border border-red-100">
                                <span className="font-semibold text-red-900">{w}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Gap Synthesis */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 md:p-10 rounded-2xl border border-amber-100 shadow-sm">
                <h3 className="text-2xl font-black text-amber-900 mb-4">Goal Alignment Synthesis 🌉</h3>
                <p className="text-amber-800 leading-relaxed text-lg font-medium">{insights.gapSynthesis}</p>
            </div>

            <div className="flex justify-center pt-8">
                <button 
                    onClick={resetModule}
                    className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold hover:bg-gray-50 hover:text-gray-800 transition-colors"
                >
                    Retake Assessment
                </button>
            </div>
        </div>
    );
};
