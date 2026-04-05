"use client";

import React from 'react';
import { useVocabStore } from '../store/useVocabStore';

export const ProgressTracker: React.FC = () => {
    const { getWordsByMastery, wordsData } = useVocabStore();
    const stats = getWordsByMastery();
    const totalWords = Object.keys(wordsData).length;

    if (totalWords === 0) return null;

    const cards = [
        { label: 'New Words', count: stats[0] || 0, color: 'text-gray-600', bg: 'bg-gray-100' },
        { label: 'Learning', count: stats[1] || 0, color: 'text-yellow-600', bg: 'bg-yellow-100' },
        { label: 'Reviewing', count: stats[2] || 0, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Mastered', count: stats[3] || 0, color: 'text-green-600', bg: 'bg-green-100' },
    ];

    return (
        <div className="w-full bg-white p-6 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
            <h3 className="font-extrabold text-xl text-gray-900 flex items-center gap-2 mb-6">
                <span className="text-2xl">📈</span> Leitner System Progress
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {cards.map((c, i) => (
                    <div key={i} className={"p-4 rounded-2xl " + c.bg}>
                        <span className="block text-3xl font-black mb-1 text-gray-900">{c.count}</span>
                        <span className={"text-xs font-bold uppercase tracking-widest " + c.color}>{c.label}</span>
                    </div>
                ))}
            </div>

            <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden flex">
                <div style={{ width: (stats[3] / totalWords) * 100 + '%' }} className="bg-green-500 h-full transition-all duration-1000"></div>
                <div style={{ width: (stats[2] / totalWords) * 100 + '%' }} className="bg-blue-500 h-full transition-all duration-1000"></div>
                <div style={{ width: (stats[1] / totalWords) * 100 + '%' }} className="bg-yellow-400 h-full transition-all duration-1000"></div>
                <div style={{ width: (stats[0] / totalWords) * 100 + '%' }} className="bg-gray-300 h-full transition-all duration-1000"></div>
            </div>
            
            <div className="mt-4 flex justify-between text-xs font-bold text-gray-500">
                <span>Total Words Tracked: {totalWords}</span>
                <span>{Math.round(((stats[3] || 0) / totalWords) * 100)}% Mastered</span>
            </div>
        </div>
    );
};
