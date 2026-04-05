import React from 'react';
import { MoodType } from '../store/useEIStore';

interface MoodSelectorProps {
    currentMood: MoodType;
    onSelectMood: (mood: MoodType) => void;
}

const MOODS: { label: MoodType; emoji: string; color: string }[] = [
    { label: 'Great', emoji: '🤩', color: 'bg-green-100 border-green-400 text-green-800' },
    { label: 'Good', emoji: '🙂', color: 'bg-teal-100 border-teal-400 text-teal-800' },
    { label: 'Okay', emoji: '😐', color: 'bg-gray-100 border-gray-400 text-gray-800' },
    { label: 'Stressed', emoji: '😖', color: 'bg-orange-100 border-orange-400 text-orange-800' },
    { label: 'Exhausted', emoji: '😴', color: 'bg-purple-100 border-purple-400 text-purple-800' },
    { label: 'Anxious', emoji: '😰', color: 'bg-red-100 border-red-400 text-red-800' }
];

export const MoodSelector: React.FC<MoodSelectorProps> = ({ currentMood, onSelectMood }) => {
    return (
        <div className="w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">How are you feeling today?</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {MOODS.map((mood) => {
                    const isSelected = currentMood === mood.label;
                    return (
                        <button
                            key={mood.label}
                            onClick={() => onSelectMood(mood.label)}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 
                            ${isSelected ? mood.color : 'bg-white border-gray-200 hover:border-gray-300 text-gray-600'}
                            ${isSelected ? 'scale-105 shadow-md' : 'shadow-sm hover:shadow'}`}
                        >
                            <span className="text-3xl mb-2">{mood.emoji}</span>
                            <span className="text-sm font-medium">{mood.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
