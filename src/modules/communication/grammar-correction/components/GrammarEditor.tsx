"use client";

import React, { useEffect, useState } from 'react';
import { useGrammarStore } from '../store/useGrammarStore';
import { CorrectionMode } from '../api/grammarApi';

export const GrammarEditor: React.FC = () => {
    const { 
        rawText, 
        setText, 
        correctionMode, 
        setMode, 
        triggerAnalysis, 
        isAnalyzing,
        error 
    } = useGrammarStore();

    // Debounce typing so we don't spam the AI endpoint
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);

        if (typingTimeout) clearTimeout(typingTimeout);

        // Only trigger analysis if text is long enough, debounced by 1.5 seconds
        if (e.target.value.trim().length > 10) {
            const timeout = setTimeout(() => {
                triggerAnalysis();
            }, 1500);
            setTypingTimeout(timeout);
        }
    };

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[500px] animate-fade-in-up">
            <div className="bg-indigo-50 border-b border-indigo-100 p-4 flex justify-between items-center rounded-t-2xl">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">✍️</span>
                    <div>
                        <h3 className="font-bold text-indigo-900">Live Editor</h3>
                        <p className="text-xs text-indigo-600">Start typing for real-time AI suggestions</p>
                    </div>
                </div>

                <div className="flex bg-white rounded-lg border border-indigo-200 overflow-hidden shadow-sm">
                    {(['basic', 'intermediate', 'advanced'] as CorrectionMode[]).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setMode(mode)}
                            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors
                                ${correctionMode === mode 
                                    ? 'bg-indigo-600 text-white' 
                                    : 'text-indigo-600 hover:bg-indigo-50'
                                }`}
                        >
                            {mode}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 relative p-4">
                <textarea
                    className="w-full h-full p-2 border-0 focus:ring-0 resize-none text-gray-800 text-lg sm:text-lg leading-relaxed bg-transparent focus:outline-none placeholder-gray-300"
                    placeholder="Type or paste your text here..."
                    value={rawText}
                    onChange={handleTextChange}
                />
                
                {/* Status Indicator */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    {isAnalyzing && (
                        <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-full flex items-center gap-2 border border-indigo-100 shadow-sm">
                            <svg className="animate-spin h-3 w-3 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Checking...
                        </span>
                    )}
                    {error && (
                        <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                            ⚠ Error
                        </span>
                    )}
                </div>
            </div>
            
            <div className="bg-gray-50 border-t border-gray-100 p-3 flex justify-between rounded-b-2xl text-xs text-gray-500 font-medium">
                <span>{rawText.length} characters</span>
                <span>{rawText.split(/\s+/).filter(w => w.length > 0).length} words</span>
            </div>
        </div>
    );
};
