"use client";

import React from 'react';
import { useSocialStore, ScenarioType } from '../store/useSocialStore';

const SCENARIOS: { type: ScenarioType; title: string; desc: string; icon: string; color: string }[] = [
    { type: 'Networking', title: 'Tech Networking Event', desc: 'Practice introducing yourself to industry peers.', icon: '🤝', color: 'indigo' },
    { type: 'Small Talk', title: 'Office Breakroom', desc: 'Engage a coworker in light, causal conversation.', icon: '☕', color: 'teal' },
    { type: 'Interviews', title: 'Behavioral Interview', desc: 'Respond gracefully to challenging behavioral questions.', icon: '💼', color: 'pink' }
];

export const ScenarioSelector: React.FC = () => {
    const { activeScenario, setScenario } = useSocialStore();

    if (activeScenario) return null;

    return (
        <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Select a Scenario to Practice</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {SCENARIOS.map((s) => (
                    <button
                        key={s.title}
                        onClick={() => setScenario(s.type)}
                        className={`flex flex-col items-start p-6 rounded-xl border-2 transition-all duration-200 bg-white border-gray-200 hover:border-${s.color}-300 shadow hover:shadow-md text-left`}
                    >
                        <span className={`text-3xl mb-4 bg-${s.color}-50 p-3 rounded-full`}>{s.icon}</span>
                        <span className="text-lg font-bold text-gray-800">{s.title}</span>
                        <span className="text-sm text-gray-500 mt-2">{s.desc}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
