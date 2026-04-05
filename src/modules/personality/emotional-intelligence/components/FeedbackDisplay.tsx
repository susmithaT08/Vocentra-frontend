"use client";

import React from 'react';
import { useEIStore } from '../store/useEIStore';

export const FeedbackDisplay: React.FC = () => {
    const { feedback, resetModule } = useEIStore();

    if (!feedback) return null;

    return (
        <div className="w-full mt-8 animate-fade-in-up">
            <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100 flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">AI Empathy Response</h2>
                        <p className="text-sm text-gray-500">Your reflection processed carefully.</p>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                        <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-line">
                            {feedback}
                        </p>
                    </div>
                </div>
                
                <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end">
                    <button 
                        onClick={resetModule}
                        className="text-sm font-semibold text-gray-600 hover:text-gray-900 bg-white px-5 py-2.5 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-all"
                    >
                        Log another reflection
                    </button>
                </div>
            </div>
        </div>
    );
};
