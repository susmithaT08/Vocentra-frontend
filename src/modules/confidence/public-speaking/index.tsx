"use client";

import React from 'react';
import { useSpeakingStore } from './store/useSpeakingStore';
import { TopicGenerator } from './components/TopicGenerator';
import { SpeechRecorder } from './components/SpeechRecorder';
import { AnalysisReport } from './components/AnalysisReport';

export const PublicSpeakingModule: React.FC = () => {
    const { sessionState, error } = useSpeakingStore();

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
            <div className="border-b border-gray-100 pb-6 mb-8 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center md:justify-start gap-3">
                    <span className="text-fuchsia-500">🎙️</span> Public Speaking
                </h1>
                <p className="mt-3 text-lg text-gray-600 max-w-2xl leading-relaxed mx-auto md:mx-0">
                    Master your delivery. Practice speaking on difficult topics and get instant AI feedback on your clarity, fluency, and pacing.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg flex items-center gap-3 animate-pulse">
                    <span className="text-xl">⚠️</span>
                    <p className="text-red-800 font-medium">{error}</p>
                </div>
            )}

            <div className="flex justify-center w-full">
                {sessionState === 'topic-selection' && <TopicGenerator />}
                {sessionState === 'recording' && <SpeechRecorder />}
                {sessionState === 'analyzing' && (
                    <div className="w-full h-[400px] bg-white rounded-3xl border border-gray-100 flex flex-col items-center justify-center animate-pulse">
                        <div className="text-6xl mb-6 animate-bounce">🤖</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Analyzing Audio...</h3>
                        <p className="text-gray-500 font-medium">Extracting transcript and evaluating metrics</p>
                    </div>
                )}
                {sessionState === 'report' && <AnalysisReport />}
            </div>
        </div>
    );
};
