"use client";

import React from 'react';
import { DailyChallenge } from './components/DailyChallenge';
import { MirrorPractice } from './components/MirrorPractice';

export const ConfidenceBuildingModule: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
            <div className="border-b border-gray-100 pb-6 mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Confidence Building</h1>
                <p className="mt-3 text-lg text-gray-600 max-w-2xl leading-relaxed">
                    Overcome self-doubt and develop a strong, authentic speaking presence. Practice securely in an isolated environment.
                </p>
            </div>

            <div className="bg-gray-50/50 p-1 md:p-6 rounded-3xl border border-gray-100 shadow-sm">
                <DailyChallenge />
                <MirrorPractice />
            </div>
        </div>
    );
};
