"use client";

import React from 'react';
import { MoodSelector } from './components/MoodSelector';
import { ReflectionBox } from './components/ReflectionBox';
import { FeedbackDisplay } from './components/FeedbackDisplay';
import { useEIStore } from './store/useEIStore';

export const EmotionalIntelligenceModule: React.FC = () => {
    const { feedback } = useEIStore();

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
            <div className="border-b border-gray-100 pb-6 mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Emotional Intelligence</h1>
                <p className="mt-3 text-lg text-gray-600 max-w-2xl leading-relaxed">
                    Safely log your feelings in this strictly isolated space. Receive tailored coaching without affecting your professional metrics or global profile.
                </p>
            </div>

            <div className="bg-gray-50/50 p-1 md:p-6 rounded-3xl border border-gray-100 shadow-sm">
                {!feedback ? (
                    <>
                        <MoodSelector />
                        <ReflectionBox />
                    </>
                ) : (
                    <FeedbackDisplay />
                )}
            </div>
        </div>
    );
};
