"use client";

import React from 'react';
import { useEIStore } from '../store/useEIStore';

export const ReflectionBox: React.FC = () => {
    const { reflectionText, setReflectionText, submitReflection, isLoading, mood, error } = useEIStore();

    const isDisabled = !mood || reflectionText.trim().length === 0 || isLoading;

    return (
        <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6 md:mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Daily Reflection</h3>
            <p className="text-sm text-gray-500 mb-4">Take a moment to write down what is on your mind.</p>
            
            <textarea
                className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow min-h-[160px] resize-y text-gray-800"
                placeholder="I am feeling this way because..."
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                disabled={isLoading}
            />
            
            {error && (
                <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                    ⚠ {error}
                </div>
            )}

            <div className="flex justify-end mt-4">
                <button
                    onClick={submitReflection}
                    disabled={isDisabled}
                    className={`px-8 py-3 rounded-xl font-bold transition-all duration-200
                        ${isDisabled 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-100'
                        }`}
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing...
                        </span>
                    ) : 'Get Insight'}
                </button>
            </div>
        </div>
    );
};
