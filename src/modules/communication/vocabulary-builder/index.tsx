"use client";

import React from 'react';
import { useVocabStore } from './store/useVocabStore';
import { WordDisplay } from './components/WordDisplay';
import { QuizEngine } from './components/QuizEngine';
import { ProgressTracker } from './components/ProgressTracker';

export const VocabularyBuilderModule: React.FC = () => {
    const { currentView, setView } = useVocabStore();

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
            <div className="border-b border-gray-100 pb-6 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center md:justify-start gap-3">
                    <span className="text-indigo-500">📖</span> Vocabulary Builder
                </h1>
                <p className="mt-3 text-lg text-gray-600 max-w-2xl leading-relaxed mx-auto md:mx-0">
                    Master professional communication. Learn contextual vocabulary with our scientific Space Repetition Leitner Engine.
                </p>
            </div>

            {/* View Architecture Navigation */}
            <div className="flex bg-gray-100 p-1 rounded-xl max-w-md mx-auto md:mx-0 shadow-inner">
                {['learning', 'quiz', 'progress'].map((v) => (
                    <button
                        key={v}
                        onClick={() => setView(v as 'learning' | 'quiz' | 'progress')}
                        className={"flex-1 py-3 text-sm font-bold capitalize rounded-lg transition-all " + (currentView === v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700')}
                    >
                        {v}
                    </button>
                ))}
            </div>

            <div className="w-full min-h-[400px]">
                {currentView === 'learning' && <WordDisplay />}
                {currentView === 'quiz' && <QuizEngine />}
                {currentView === 'progress' && <ProgressTracker />}
            </div>
        </div>
    );
};
