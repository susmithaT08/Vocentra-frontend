"use client";

import React from 'react';
import { useDiscoveryStore } from '../store/useDiscoveryStore';

const QUESTIONS = [
    {
        id: 'q1',
        text: 'When faced with a sudden, unexpected change in plans, how do you usually react?',
        options: [
            { value: 1, label: 'Get frustrated and resist the change' },
            { value: 2, label: 'Feel anxious but try to adapt slowly' },
            { value: 3, label: 'Immediately look for new opportunities in the situation' }
        ]
    },
    {
        id: 'q2',
        text: 'In a group project, what role do you naturally gravitate towards?',
        options: [
            { value: 1, label: 'The visionary who comes up with the big ideas' },
            { value: 2, label: 'The organizer who assigns tasks and keeps schedules' },
            { value: 3, label: 'The mediator who ensures everyone is heard and happy' }
        ]
    },
    {
        id: 'q3',
        text: 'How do you prefer to recharge after a long, exhausting week?',
        options: [
            { value: 1, label: 'Going out with a large group of friends' },
            { value: 2, label: 'A mix of socializing and alone time' },
            { value: 3, label: 'Reading a book or watching a movie alone in silence' }
        ]
    }
];

export const PersonalityAssessment: React.FC = () => {
    const { answers, setAnswer, nextStep, error } = useDiscoveryStore();

    return (
        <div className="w-full bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center animate-fade-in-up">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Step 1: Discover Your Baseline</h3>
            <p className="text-gray-500 mb-8 text-center max-w-lg">Answer these quick situational questions to help our AI engine understand your natural tendencies and operating style.</p>
            
            <div className="w-full space-y-8">
                {QUESTIONS.map((q, index) => (
                    <div key={q.id} className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <p className="font-semibold text-gray-800 mb-4">{index + 1}. {q.text}</p>
                        <div className="space-y-3">
                            {q.options.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => setAnswer(q.id, opt.value)}
                                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200
                                        ${answers[q.id] === opt.value 
                                            ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500 font-medium text-indigo-900' 
                                            : 'bg-white border-gray-200 hover:border-indigo-300 hover:bg-gray-50 text-gray-700'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {error && (
                <div className="mt-6 w-full text-sm font-semibold text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 flex items-center justify-center">
                    ⚠ {error}
                </div>
            )}

            <button
                onClick={nextStep}
                className="mt-8 px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow focus:ring-4 focus:ring-indigo-100 transition-all active:scale-95"
            >
                Continue to Goal Alignment ➔
            </button>
        </div>
    );
};
