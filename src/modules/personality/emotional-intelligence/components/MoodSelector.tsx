"use client";

import React from 'react';
import { useEIStore, Mood } from '../store/useEIStore';

const MOODS: { label: Mood; emoji: string; color: string }[] = [
    { label: 'Happy', emoji: '😊', color: 'bg-green-100 border-green-400 text-green-800' },
    { label: 'Neutral', emoji: '😐', color: 'bg-blue-100 border-blue-400 text-blue-800' },
    { label: 'Sad', emoji: '😔', color: 'bg-gray-100 border-gray-400 text-gray-800' },
    { label: 'Angry', emoji: '😠', color: 'bg-red-100 border-red-400 text-red-800' },
    { label: 'Anxious', emoji: '😰', color: 'bg-orange-100 border-orange-400 text-orange-800' }
];

export const MoodSelector: React.FC = () => {
    const { mood, setMood, isLoading } = useEIStore();

    return (
        <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">How are you feeling?</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {MOODS.map((m) => {
                    const isSelected = mood === m.label;
                    return (
                        <button
                            key={m.label}
                            onClick={() => setMood(m.label)}
                            disabled={isLoading}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 
                            ${isSelected ? m.color : 'bg-white border-gray-200 hover:border-blue-300 text-gray-600'}
                            ${isSelected ? 'scale-105 shadow-md' : 'shadow-sm hover:shadow'}
                            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span className="text-4xl mb-2">{m.emoji}</span>
                            <span className="text-sm font-semibold">{m.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
