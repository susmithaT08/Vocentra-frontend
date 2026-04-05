"use client";

import React from 'react';
import { useDiscoveryStore } from '../store/useDiscoveryStore';

export const GoalAlignment: React.FC = () => {
    const { userGoal, setGoal, nextStep, isLoading, error } = useDiscoveryStore();

    return (
        <div className="w-full bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center animate-fade-in-up text-center">
            <span className="text-5xl mb-6">🎯</span>
            <h3 className="text-3xl font-extrabold text-gray-800 mb-3">Step 2: Align Your Ambitions</h3>
            <p className="text-gray-500 mb-8 max-w-xl text-lg">
                Now that we have your baseline, what is the ultimate goal you are trying to achieve? Our AI will cross-reference your traits against this target.
            </p>
            
            <div className="w-full max-w-2xl bg-indigo-50/50 p-6 md:p-8 rounded-2xl border border-indigo-100">
                <label className="block text-left text-sm font-bold text-indigo-900 mb-3 uppercase tracking-wider">Your Primary Goal</label>
                <textarea
                    className="w-full p-4 rounded-xl border-2 border-indigo-200 focus:outline-none focus:ring-0 focus:border-indigo-500 transition-colors min-h-[120px] resize-none text-gray-800 text-lg shadow-inner"
                    placeholder="e.g. 'I want to transition from a technical role into a management position within the next year.'"
                    value={userGoal}
                    onChange={(e) => setGoal(e.target.value)}
                    disabled={isLoading}
                />
            </div>

            {error && (
                <div className="mt-6 w-full max-w-2xl text-sm font-semibold text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
                    ⚠ {error}
                </div>
            )}

            <button
                onClick={nextStep}
                disabled={isLoading}
                className={`mt-10 px-10 py-4 font-bold rounded-xl text-lg flex items-center gap-3 transition-all
                    ${isLoading 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md focus:ring-4 focus:ring-indigo-100 hover:-translate-y-1'
                    }`}
            >
                {isLoading && (
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {isLoading ? 'Synthesizing Genome...' : 'Generate My Insights ⚡'}
            </button>
        </div>
    );
};
