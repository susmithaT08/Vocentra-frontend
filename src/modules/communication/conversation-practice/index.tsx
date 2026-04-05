"use client";

import React from 'react';
import { useConversationStore } from './store/useConversationStore';
import { ScenarioConfigurator } from './components/ScenarioConfigurator';
import { ChatSimulator } from './components/ChatSimulator';
import { LiveMetricsSidebar } from './components/LiveMetricsSidebar';

export const ConversationPracticeModule: React.FC = () => {
    const { sessionState } = useConversationStore();

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
            <div className="border-b border-gray-100 pb-6 mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">AI Conversation Simulator</h1>
                <p className="mt-3 text-lg text-gray-600 max-w-2xl leading-relaxed">
                    Practice real-world dialogues with a highly responsive AI that adapts its persona dynamically while evaluating your fluency and confidence.
                </p>
            </div>

            {sessionState === 'config' || sessionState === 'finished' ? (
                <div className="flex justify-center mt-12 w-full max-w-2xl mx-auto">
                    <ScenarioConfigurator />
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 min-w-[50%] lg:max-w-2xl">
                        <ChatSimulator />
                    </div>
                    <div className="flex-1 w-full lg:max-w-sm">
                        <LiveMetricsSidebar />
                    </div>
                </div>
            )}
        </div>
    );
};
