"use client";

import React from 'react';
import { useConversationStore } from '../store/useConversationStore';

export const ScenarioConfigurator: React.FC = () => {
    const { scenario, difficulty, aiPersonality, durationMinutes, setConfig, startSession } = useConversationStore();

    return (
        <div className="w-full bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center animate-fade-in-up">
            <h3 className="text-3xl font-extrabold text-gray-900 mb-3 text-center">Design Your Scenario</h3>
            <p className="text-gray-500 mb-8 text-center max-w-lg">Customize the exact communication environment you want to practice in before stepping into the simulator.</p>
            
            <div className="w-full max-w-xl space-y-6">
                
                {/* Scenario Selection */}
                <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Target Scenario</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {['Job Interview', 'Networking Event', 'Casual Chat'].map(opt => (
                            <button
                                key={opt}
                                onClick={() => setConfig(opt, difficulty, aiPersonality, durationMinutes)}
                                className={`p-3 rounded-xl border text-sm font-semibold transition-all
                                    ${scenario === opt 
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                                    }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Personality & Difficulty */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">AI Persona</label>
                        <select 
                            value={aiPersonality}
                            onChange={(e) => setConfig(scenario, difficulty, e.target.value, durationMinutes)}
                            className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:ring-0 appearance-none bg-gray-50 text-gray-800 font-medium"
                        >
                            <option value="Friendly and Encouraging">Friendly & Encouraging</option>
                            <option value="Professional and Formal">Professional & Formal</option>
                            <option value="Strict and Analytical">Strict & Analytical</option>
                        </select>
                    </div>
                    
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Difficulty</label>
                        <select 
                            value={difficulty}
                            onChange={(e) => setConfig(scenario, e.target.value, aiPersonality, durationMinutes)}
                            className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:ring-0 appearance-none bg-gray-50 text-gray-800 font-medium"
                        >
                            <option value="Easy">Easy (Forgiving)</option>
                            <option value="Medium">Medium (Standard)</option>
                            <option value="Hard">Hard (Challenges you)</option>
                        </select>
                    </div>
                </div>

                <div className="pt-8">
                    <button
                        onClick={startSession}
                        className="w-full py-4 bg-gray-900 text-white font-bold text-lg rounded-xl hover:bg-black shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <span>🎤</span> Enter Simulator
                    </button>
                </div>
            </div>
        </div>
    );
};
