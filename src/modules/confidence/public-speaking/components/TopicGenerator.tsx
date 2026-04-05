"use client";

import React, { useEffect } from 'react';
import { useSpeakingStore, Difficulty } from '../store/useSpeakingStore';

export const TopicGenerator: React.FC = () => {
    const { topic, difficulty, setDifficulty, generateTopic, startRecording } = useSpeakingStore();

    // Generate initial topic on mount
    useEffect(() => {
        if (topic === "Click 'Generate Topic' to begin.") {
            generateTopic();
        }
    }, [topic, generateTopic]);

    return (
        <div className="w-full bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center animate-fade-in-up text-center">
            <h3 className="text-3xl font-extrabold text-gray-900 mb-3">Welcome to the Stage</h3>
            <p className="text-gray-500 mb-8 max-w-lg">Select your difficulty and grab a prompt. When you're ready, hit start to begin your virtual speaking session.</p>
            
            <div className="w-full max-w-xl space-y-8">
                
                {/* Difficulty */}
                <div className="inline-flex bg-gray-100 rounded-xl p-1 w-full max-w-md border border-gray-200 shadow-inner">
                    {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map(level => (
                        <button
                            key={level}
                            onClick={() => setDifficulty(level)}
                            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-all
                                ${difficulty === level 
                                    ? 'bg-white text-blue-600 shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-800'
                                }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>

                {/* The Prompt */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-2 right-4 text-6xl opacity-10">🎙️</div>
                    <span className="text-xs font-black text-blue-400 uppercase tracking-widest block mb-4">Your Prompt</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-blue-900 leading-snug drop-shadow-sm">"{topic}"</h2>
                    
                    <button 
                        onClick={generateTopic}
                        className="mt-6 text-sm font-bold flex items-center gap-2 mx-auto text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <span>🔄</span> Spin New Topic
                    </button>
                </div>

                <div className="pt-4">
                    <button
                        onClick={startRecording}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                        <span className="w-3 h-3 bg-red-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(248,113,113,0.8)]"></span> Start Recording
                    </button>
                </div>
            </div>
        </div>
    );
};
