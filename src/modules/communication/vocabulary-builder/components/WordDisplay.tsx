"use client";

import React, { useEffect } from 'react';
import { useVocabStore } from '../store/useVocabStore';

export const WordDisplay: React.FC = () => {
    const { getWordsForToday, loadDailyWords, isGenerating, activeCategory, setCategory } = useVocabStore();
    
    // Auto-load words if the queue is empty
    const wordsToReview = getWordsForToday();

    useEffect(() => {
        if (wordsToReview.length === 0 && !isGenerating) {
            loadDailyWords();
        }
    }, [wordsToReview.length, isGenerating, loadDailyWords]);

    return (
        <div className="w-full bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center animate-fade-in-up">
            <div className="w-full flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h3 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                    <span className="text-3xl">📚</span> Today's Words
                </h3>
                
                <select 
                    value={activeCategory}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        loadDailyWords();
                    }}
                    disabled={isGenerating}
                    className="p-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold text-gray-700 outline-none focus:border-indigo-400"
                >
                    <option value="Daily Conversation">Daily Conversation</option>
                    <option value="Interview">Interview Prep</option>
                    <option value="Persuasion">Persuasion & Sales</option>
                </select>
            </div>

            {isGenerating ? (
                <div className="w-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl animate-pulse">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 font-bold">Curating new {activeCategory} vocabulary...</p>
                </div>
            ) : wordsToReview.length === 0 ? (
                <div className="w-full py-16 text-center bg-green-50 rounded-2xl border border-green-100">
                    <span className="text-4xl mb-3 block">🎉</span>
                    <h4 className="text-xl font-bold text-green-800">You're all caught up!</h4>
                    <p className="text-green-600 mt-2">You have reviewed all your scheduled vocabulary for now.</p>
                </div>
            ) : (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                    {wordsToReview.slice(0, 4).map(word => (
                        <div key={word.id} className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100 shadow-sm hover:-translate-y-1 transition-transform cursor-default relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-20 rounded-full -translate-y-1/2 translate-x-1/3 group-hover:scale-110 transition-transform"></div>
                            
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-2xl font-black text-indigo-900 tracking-tight">{word.word}</h4>
                                <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase px-2 py-1 rounded-full">{word.masteryLevel > 0 ? 'Review' : 'New'}</span>
                            </div>
                            <p className="text-indigo-400 font-mono text-sm mb-4">{word.phonetics}</p>
                            
                            <p className="font-semibold text-gray-700 mb-4">{word.definition}</p>
                            
                            <div className="bg-white/60 p-3 rounded-xl border border-white backdrop-blur-sm">
                                <p className="text-sm italic text-gray-600 font-medium">"{word.example}"</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
