"use client";

import React from 'react';
import { useConfidenceStore } from '../store/useConfidenceStore';

export const DailyChallenge: React.FC = () => {
    const { dailyStreak, sessionsCompleted, averageScore, currentDifficulty, setDifficulty } = useConfidenceStore();

    return (
        <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <span>🔥</span> {dailyStreak} Day Streak!
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    You have completed {sessionsCompleted} mirror practices. Your average confidence baseline is <span className="font-bold text-indigo-600">{averageScore}/100</span>.
                </p>
                <div className="flex gap-2">
                    {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                        <button
                            key={level}
                            onClick={() => setDifficulty(level as any)}
                            className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors
                                ${currentDifficulty === level 
                                    ? 'bg-indigo-600 text-white border-indigo-600' 
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                                }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="hidden md:flex items-center justify-center p-4 bg-indigo-50 rounded-xl border border-indigo-100 min-w-[150px]">
                <div className="text-center">
                    <span className="block text-2xl font-black text-indigo-700">{averageScore}</span>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Baseline Score</span>
                </div>
            </div>
        </div>
    );
};
