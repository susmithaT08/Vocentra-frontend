"use client";

import React from 'react';
import { GrammarEditor } from './components/GrammarEditor';
import { CorrectionCards } from './components/CorrectionCards';

export const GrammarCorrectionModule: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
            <div className="border-b border-gray-100 pb-6 mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Grammar & Style Studio</h1>
                    <p className="mt-3 text-lg text-gray-600 max-w-2xl leading-relaxed">
                        Draft your text and let our AI engine instantly detect grammatical errors, analyze your tone, and suggest professional rewrites in real-time.
                    </p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 min-w-[50%]">
                    <GrammarEditor />
                </div>
                <div className="flex-1 w-full lg:max-w-[400px]">
                    <CorrectionCards />
                </div>
            </div>
        </div>
    );
};
