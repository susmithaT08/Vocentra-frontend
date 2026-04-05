"use client";

import React, { useState } from 'react';
import { useVocabStore, LearningWord } from '../store/useVocabStore';

export const QuizEngine: React.FC = () => {
    const { getWordsForToday, processQuizAnswer, wordsData } = useVocabStore();
    
    const wordsToReview = getWordsForToday();
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrectState, setIsCorrectState] = useState<boolean | null>(null);

    if (wordsToReview.length === 0) {
        return (
            <div className="w-full bg-white p-12 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center animate-fade-in-up">
                <span className="text-5xl mb-4">🏆</span>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">No Words Due for Review!</h3>
                <p className="text-gray-500 max-w-sm">You have mastered your queue. Check back later or load a new category to expand your vocabulary.</p>
            </div>
        );
    }

    const currentWord = wordsToReview[currentWordIndex];
    if (!currentWord) return null;

    // Generate random distractors using other words in store or hardcoded fallbacks
    const allStoreWords = Object.values(wordsData).map(w => w.word).filter(w => w !== currentWord.word);
    const distractors = allStoreWords.length >= 3 
        ? allStoreWords.sort(() => 0.5 - Math.random()).slice(0, 3) 
        : ["ubiquitous", "pragmatic", "eloquent"];
        
    const options = [currentWord.word, ...distractors].sort(() => 0.5 - Math.random());

    const handleAnswer = (answer: string) => {
        if (selectedAnswer !== null) return;
        
        setSelectedAnswer(answer);
        const correct = answer === currentWord.word;
        setIsCorrectState(correct);
        
        processQuizAnswer(currentWord.id, correct);

        setTimeout(() => {
            setSelectedAnswer(null);
            setIsCorrectState(null);
            // Don't need to increment index because the store nextReviewDate pushed it to the future,
            // meaning getWordsForToday() will automatically cycle the array for the next render.
        }, 1500);
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-gray-900 p-6 md:p-10 rounded-3xl shadow-xl text-center animate-scale-in">
            <span className="text-xs font-black text-indigo-400 uppercase tracking-widest block mb-2">Spaced Repetition Quiz</span>
            <div className="mb-8">
                <h3 className="text-xl md:text-2xl text-white font-medium mb-6">
                    Which word matches this definition?
                </h3>
                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 mx-auto">
                    <p className="text-lg font-bold text-gray-200">"{currentWord.definition}"</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.map((opt, i) => {
                    let btnClass = "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700";
                    if (selectedAnswer) {
                        if (opt === currentWord.word) btnClass = "bg-green-600 border-green-500 text-white animate-pulse";
                        else if (opt === selectedAnswer) btnClass = "bg-red-600 border-red-500 text-white";
                        else btnClass = "bg-gray-800 border-gray-700 text-gray-500 opacity-50 cursor-not-allowed";
                    }

                    return (
                        <button
                            key={i}
                            disabled={selectedAnswer !== null}
                            onClick={() => handleAnswer(opt)}
                            className={"py-4 px-6 rounded-xl border-2 font-bold text-lg transition-all " + btnClass}
                        >
                            {opt}
                        </button>
                    );
                })}
            </div>

            {isCorrectState !== null && (
                <div className="mt-8 text-xl font-bold animate-fade-in-up">
                    {isCorrectState 
                        ? <span className="text-green-400">✅ Correct! Spacing interval increased.</span> 
                        : <span className="text-red-400">❌ Incorrect. Spacing interval reset.</span>
                    }
                </div>
            )}
        </div>
    );
};
