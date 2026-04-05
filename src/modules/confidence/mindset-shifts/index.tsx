"use client";

import React from 'react';
import { BeliefReframeEngine } from './components/BeliefReframeEngine';
import { HabitTracker } from './components/HabitTracker';
import { ProgressDashboard } from './components/ProgressDashboard';

export const MindsetShiftsModule: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
            <div className="border-b border-gray-100 pb-6 mb-8 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center md:justify-start gap-3">
                    <span className="text-yellow-500">🧠</span> Mindset Shifts
                </h1>
                <p className="mt-3 text-lg text-gray-600 max-w-2xl leading-relaxed mx-auto md:mx-0">
                    Transform limiting beliefs into powerful growth mindsets, and solidify them through dynamically generated micro-habits and daily streaks.
                </p>
            </div>

            <div className="w-full">
                <BeliefReframeEngine />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pt-6">
                <div className="lg:col-span-5 h-full">
                    <HabitTracker />
                </div>
                <div className="lg:col-span-7 h-full">
                    <ProgressDashboard />
                </div>
            </div>
        </div>
    );
};
