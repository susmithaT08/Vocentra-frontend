import React from 'react';
import { AIFeedback } from '../store/useEIStore';

interface FeedbackCardProps {
    feedback: AIFeedback;
    onReset: () => void;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, onReset }) => {
    return (
        <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mt-8 animate-fade-in-up">
            
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex gap-4 items-center">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">AI Empathy Response</h2>
                        <p className="text-sm text-gray-500">Your reflection processed objectively.</p>
                    </div>
                </div>
                
                {/* Score */}
                <div className="flex flex-col items-center bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Balance Score</span>
                    <span className={`text-2xl font-black ${
                        feedback.emotionalHealthScore >= 70 ? 'text-green-600' : 
                        feedback.emotionalHealthScore >= 40 ? 'text-yellow-500' : 'text-orange-500'
                    }`}>
                        {feedback.emotionalHealthScore}/100
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col gap-6">
                
                {/* Empathy Message */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-gray-700 italic text-lg leading-relaxed">
                        "{feedback.empathyMessage}"
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Strengths */}
                    <div className="flex flex-col gap-3">
                        <h4 className="flex items-center gap-2 font-semibold text-gray-800">
                            <span className="text-green-500">✨</span> Strengths Identified
                        </h4>
                        <ul className="space-y-2">
                            {feedback.strengths.map((str, i) => (
                                <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                                    <span className="text-green-500 mt-0.5">•</span> {str}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Advice */}
                    <div className="flex flex-col gap-3">
                        <h4 className="flex items-center gap-2 font-semibold text-gray-800">
                            <span className="text-blue-500">🎯</span> Actionable Advice
                        </h4>
                        <ul className="space-y-2">
                            {feedback.actionableAdvice.map((adv, i) => (
                                <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                                    <span className="text-blue-500 mt-0.5">→</span> {adv}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            
            <div className="bg-gray-50 p-4 flex justify-end">
                <button 
                    onClick={onReset}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-all"
                >
                    Log another reflection
                </button>
            </div>
        </div>
    );
};
