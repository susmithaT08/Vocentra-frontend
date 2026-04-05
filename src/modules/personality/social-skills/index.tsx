"use client";

import React from 'react';
import { ScenarioSelector } from './components/ScenarioSelector';
import { ConversationSimulator } from './components/ConversationSimulator';
import { FeedbackEngine } from './components/FeedbackEngine';

export const SocialSkillsModule: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
            <div className="border-b border-gray-100 pb-6 mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Social Skills Simulator</h1>
                <p className="mt-3 text-lg text-gray-600 max-w-2xl leading-relaxed">
                    Elevate your conversational abilities. Practice networking, small talk, and interviews with real-time AI feedback in a safe, dynamic environment.
                </p>
            </div>

            <div className="bg-gray-50/50 p-1 md:p-6 rounded-3xl border border-gray-100 shadow-sm">
                <ScenarioSelector />
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 min-w-[50%]">
                        <ConversationSimulator />
                    </div>
                    <div className="flex-1">
                        <FeedbackEngine />
                    </div>
                </div>
            </div>
        </div>
    );
};
