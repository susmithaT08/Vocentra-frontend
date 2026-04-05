"use client";

import React from 'react';
import { PersonalityAssessment } from './components/PersonalityAssessment';
import { GoalAlignment } from './components/GoalAlignment';
import { InsightsDashboard } from './components/InsightsDashboard';
import { useDiscoveryStore } from './store/useDiscoveryStore';

export const SelfDiscoveryModule: React.FC = () => {
    const { currentStep } = useDiscoveryStore();

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
            <div className="border-b border-gray-100 pb-6 mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Self-Discovery Profile</h1>
                <p className="mt-3 text-lg text-gray-600 max-w-2xl leading-relaxed">
                    Map your core personality traits against your highest ambitions. Let our AI engine reveal your archetype, strengths, and the actionable gaps to your goals.
                </p>
                
                {/* Progress Indicators */}
                <div className="flex gap-2 mt-6">
                    <div className={`h-2 flex-1 rounded-full ${currentStep === 'assessment' || currentStep === 'goal' || currentStep === 'insights' ? 'bg-indigo-600' : 'bg-gray-200'} transition-colors duration-500`}></div>
                    <div className={`h-2 flex-1 rounded-full ${currentStep === 'goal' || currentStep === 'insights' ? 'bg-indigo-600' : 'bg-gray-200'} transition-colors duration-500 delay-100`}></div>
                    <div className={`h-2 flex-1 rounded-full ${currentStep === 'insights' ? 'bg-indigo-600' : 'bg-gray-200'} transition-colors duration-500 delay-200`}></div>
                </div>
            </div>

            <div className="bg-gray-50/50 p-1 md:p-6 rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative min-h-[500px]">
                {currentStep === 'assessment' && <PersonalityAssessment />}
                {currentStep === 'goal' && <GoalAlignment />}
                {currentStep === 'insights' && <InsightsDashboard />}
            </div>
        </div>
    );
};
