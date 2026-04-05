"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSpeakingStore } from '../store/useSpeakingStore';

export const SpeechRecorder: React.FC = () => {
    const { topic, stopRecording, submitRecording } = useSpeakingStore();
    
    const [seconds, setSeconds] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [mockTranscript, setMockTranscript] = useState('');
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Simulated dictation lines for UI realism
    const mockDictationSentences = [
        "So, jumping right into the topic... ",
        "I believe that one of the most critical aspects we can discuss is how this impacts our daily lives. ",
        "Um, let me think about an example. Like, recently I faced a similar situation. ",
        "It's fascinating how technology has entirely revolutionized this space. ",
        "You know, fundamentally, building the right habits is the key to mastering this challenge. ",
        "In conclusion, approaching this with the right mindset makes all the difference."
    ];

    useEffect(() => {
        if (!isPaused) {
            timerRef.current = setInterval(() => {
                setSeconds(s => s + 1);
                
                // Simulate speech to text appending every 4 seconds
                if (seconds > 0 && seconds % 4 === 0) {
                    const randomSentence = mockDictationSentences[Math.floor(Math.random() * mockDictationSentences.length)];
                    setMockTranscript(prev => prev + randomSentence);
                }
            }, 1000);
        }
        
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPaused, seconds]);

    const handleFinish = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        // Save the simulated state
        stopRecording(mockTranscript || "Testing phrase: Audio capabilities were turned off but user attempted speech.", seconds);
        // Trigger the backend API submission automatically
        submitRecording();
    };

    const formatTime = (totalSeconds: number) => {
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className="w-full bg-gray-900 p-6 md:p-10 rounded-3xl shadow-xl flex flex-col items-center animate-fade-in-up">
            <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-2xl border border-gray-700 mb-8 relative">
                <span className="absolute -top-3 left-6 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow">
                    Active Prompt
                </span>
                <h3 className="text-xl md:text-2xl text-white font-medium italic mt-2 text-center text-blue-100">"{topic}"</h3>
            </div>

            {/* Audio Visualizer Mock */}
            <div className="h-32 w-full flex items-center justify-center gap-2 md:gap-3 mb-10 overflow-hidden">
                {[...Array(15)].map((_, i) => (
                    <div 
                        key={i} 
                        className={`w-3 md:w-5 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-full transition-all duration-100 
                            ${!isPaused ? 'animate-waveform' : 'h-4 opacity-30'}
                        `}
                        style={{ 
                            animationDelay: `${Math.random() * 0.5}s`,
                            height: !isPaused ? `${Math.max(20, Math.random() * 100)}%` : '10%'
                        }}
                    ></div>
                ))}
            </div>

            <div className="text-6xl font-black text-white tracking-widest mb-10 tabular-nums drop-shadow-lg">
                {formatTime(seconds)}
            </div>

            <div className="flex items-center gap-6">
                <button 
                    onClick={() => setIsPaused(!isPaused)}
                    className="w-16 h-16 rounded-full bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center text-2xl border-2 border-gray-600 transition-all active:scale-95"
                >
                    {isPaused ? '▶️' : '⏸️'}
                </button>
                <button 
                    onClick={handleFinish}
                    className="px-8 py-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-lg shadow-red-500/30 border-2 border-red-500 flex items-center gap-3 transition-all active:scale-95"
                >
                    <span className="w-4 h-4 rounded-sm bg-white"></span>
                    Finish & Analyze
                </button>
            </div>
            
            <p className="text-gray-500 text-sm mt-8 mt-auto flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Microphone active
            </p>
        </div>
    );
};
