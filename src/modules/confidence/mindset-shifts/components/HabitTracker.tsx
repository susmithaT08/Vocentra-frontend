"use client";

import React from 'react';
import { useMindsetStore, TrackedHabit } from '../store/useMindsetStore';

const HabitItem: React.FC<{ habit: TrackedHabit; toggle: (id: string) => void }> = ({ habit, toggle }) => (
    <div className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group
        ${habit.completedToday 
            ? 'bg-green-50 border-green-200 shadow-sm' 
            : 'bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50'}`}
        onClick={() => toggle(habit.id)}
    >
        <div className="flex items-center gap-4">
            <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-colors
                ${habit.completedToday ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300'}`}
            >
                {habit.completedToday && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
            </div>
            <span className={`font-semibold md:text-lg ${habit.completedToday ? 'text-green-800 line-through opacity-70' : 'text-gray-800'}`}>
                {habit.title}
            </span>
        </div>
        <div className="flex flex-col items-center">
            <span className="text-xl">🔥</span>
            <span className="text-xs font-bold text-gray-500">{habit.streak}</span>
        </div>
    </div>
);

export const HabitTracker: React.FC = () => {
    const { activeHabits, toggleHabit } = useMindsetStore();

    if (activeHabits.length === 0) return null;

    return (
        <div className="w-full bg-white p-6 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-extrabold text-xl text-gray-900 flex items-center gap-2">
                    <span className="text-2xl">🌱</span> Growth Habits
                </h3>
                <span className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1 rounded-full uppercase tracking-widest">{activeHabits.length} Active</span>
            </div>
            <div className="space-y-3">
                {activeHabits.map(habit => (
                    <HabitItem key={habit.id} habit={habit} toggle={toggleHabit} />
                ))}
            </div>
        </div>
    );
};
