"use client";

import React from 'react';
import { useMindsetStore, TrackedBelief } from '../store/useMindsetStore';

export const ProgressDashboard: React.FC = () => {
    const { beliefHistory } = useMindsetStore();

    if (beliefHistory.length === 0) return null;

    return (
        <div className="w-full bg-white p-6 rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
            <h3 className="font-extrabold text-xl text-gray-900 flex items-center gap-2 mb-6">
                <span className="text-2xl">📜</span> Shift History
            </h3>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                {beliefHistory.map((item, idx) => (
                    <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-blue-100 text-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform group-hover:scale-110">
                            <span className="text-xs font-bold">{beliefHistory.length - idx}</span>
                        </div>
                        <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-2xl border border-gray-100 bg-gray-50 shadow-sm transition-all hover:bg-white hover:shadow-md">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">
                                    {new Date(item.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-gray-500 line-through opacity-70 italic mb-2">"{item.limitingBelief}"</p>
                            <p className="text-[15px] font-bold text-gray-800">"{item.reframedThought}"</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
