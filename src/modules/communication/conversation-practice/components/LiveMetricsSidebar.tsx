"use client";

import React from 'react';
import { useConversationStore } from '../store/useConversationStore';

interface ProgressBarProps {
    label: string;
    value: number;
    colorClass: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, colorClass }) => (
    <div className="mb-4 last:mb-0">
        <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-gray-600 uppercase tracking-widest">{label}</span>
            <span className={colorClass}>{value}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div 
                className={`h-2 rounded-full transition-all duration-1000 ease-out bg-current ${colorClass}`}
                style={{ width: `${value}%` }}
            ></div>
        </div>
    </div>
);

export const LiveMetricsSidebar: React.FC = () => {
    const { latestMetrics, latestCoaching } = useConversationStore();

    // Default static metrics before the first user ping
    const metrics = latestMetrics || { grammar: 100, fluency: 100, relevance: 100, confidence: 100 };

    return (
        <div className="w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col h-[600px] animate-fade-in-up">
            <div className="mb-6">
                <h3 className="font-extrabold text-xl text-gray-900 flex items-center gap-2">
                    <span className="text-2xl">📊</span> Live Performance
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-1">Evaluated after every turn</p>
            </div>

            <div className="flex-1 space-y-6">
                <ProgressBar label="Grammar" value={metrics.grammar} colorClass="text-purple-500" />
                <ProgressBar label="Fluency" value={metrics.fluency} colorClass="text-emerald-500" />
                <ProgressBar label="Relevance" value={metrics.relevance} colorClass="text-blue-500" />
                <ProgressBar label="Confidence" value={metrics.confidence} colorClass="text-amber-500" />
            </div>

            {latestCoaching && (
                <div className="mt-auto bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-2xl border border-indigo-100 shadow-inner">
                    <span className="text-xs font-black text-indigo-400 uppercase tracking-wider mb-2 block flex items-center gap-1">
                        <span>💡</span> AI Coaching
                    </span>
                    <p className="text-indigo-900 font-medium text-sm leading-relaxed italic">
                        "{latestCoaching}"
                    </p>
                </div>
            )}
        </div>
    );
};
