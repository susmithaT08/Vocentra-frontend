'use client';

import { useEffect } from 'react';
import ProgressBar from '@/components/ProgressBar';
import Link from 'next/link';
import { useProgressStore } from '@/store/useProgressStore';

type ProgressData = {
    communication: number;
    personality: number;
    career: number;
    confidence: number;
};

export default function DashboardPage() {
    const { metrics, initProgress, analyzePerformance, isAnalyzing, insights, suggestions } = useProgressStore();

    useEffect(() => {
        initProgress();
    }, [initProgress]);

    return (
        <div className="view-content animate-slide-up">
            {/* Welcome Header */}
            <div className="mb-8">
                <h2 className="font-display text-3xl lg:text-4xl font-semibold text-white mb-2">Welcome back, Explorer</h2>
                <p className="text-white/50 text-lg">Your journey to excellence continues today</p>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                <ProgressCard title="Communication" percentage={metrics.communication} color="emerald" icon="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                <ProgressCard title="Personality" percentage={metrics.personality} color="amber" icon="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <ProgressCard title="Career Ready" percentage={metrics.career} color="rose" icon="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                <ProgressCard title="Confidence" percentage={metrics.confidence} color="violet" icon="M13 10V3L4 14h7v7l9-11h-7z" />
            </div>

            {/* Quick Actions & AI Assistant */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 glass-card rounded-2xl p-6">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                            <span className="text-2xl">🤖</span>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold text-lg mb-1">Your AI Growth Partner</h3>
                            <p className="text-white/50 text-sm">I&apos;m here to help you grow. Where would you like to start?</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <QuickAction title="Speaking Practice" desc="Improve pronunciation" icon="🎤" color="emerald" link="/dashboard/communication" />
                        <QuickAction title="Vocabulary Builder" desc="Expand your words" icon="📚" color="blue" link="/dashboard/vocabulary" />
                        <QuickAction title="Mock Interview" desc="Practice with AI" icon="👔" color="rose" link="/dashboard/career" />
                        <QuickAction title="Resume Builder" desc="Craft your story" icon="📄" color="violet" link="/dashboard/career" />
                    </div>
                </div>

                {/* AI Performance Insights */}
                <div className="glass-card rounded-2xl p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-white font-semibold">AI Insights</h3>
                        <button 
                            onClick={() => analyzePerformance()}
                            disabled={isAnalyzing}
                            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${isAnalyzing ? 'bg-white/5 text-white/40 cursor-not-allowed' : 'bg-violet-500/20 text-violet-300 hover:bg-violet-500/30'}`}
                        >
                            {isAnalyzing ? 'Analyzing...' : 'Refresh'}
                        </button>
                    </div>
                    
                    <div className="space-y-4 flex-grow overflow-y-auto max-h-64 pr-2 custom-scrollbar">
                        {insights.length > 0 ? (
                            <>
                                {insights.map((insight: string, idx: number) => (
                                    <div key={`insight-${idx}`} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                        <div className="text-emerald-400 mt-0.5">✨</div>
                                        <p className="text-white/70 text-sm leading-relaxed">{insight}</p>
                                    </div>
                                ))}
                                {suggestions.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-white/5">
                                        <h4 className="text-xs uppercase tracking-wider text-white/40 font-semibold mb-3">Suggested Focus</h4>
                                        <div className="space-y-2">
                                            {suggestions.map((suggestion: string, idx: number) => (
                                                <div key={`sug-${idx}`} className="flex items-center gap-2 text-sm text-white/60">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>
                                                    {suggestion}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center py-6">
                                <div className="text-3xl mb-3 opacity-50">📊</div>
                                <p className="text-white/50 text-sm">Click refresh to let AI analyze your recent activities and generate personalized insights.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProgressCard({ title, percentage, color, icon }: { title: string, percentage: number, color: string, icon: string }) {
    return (
        <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${color}-500/20 to-${color}-600/20 flex items-center justify-center`}>
                    <svg className={`w-6 h-6 text-${color}-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                    </svg>
                </div>
            </div>
            <h3 className="text-white/60 text-sm mb-1">{title}</h3>
            <p className="text-white text-2xl font-semibold">{percentage}%</p>
            <ProgressBar progress={percentage} color={color} />
        </div>
    );
}

function QuickAction({ title, desc, icon, color, link }: { title: string, desc: string, icon: string, color: string, link: string }) {
    return (
        <Link href={link} className={`group flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-${color}-500/20 border border-white/5 hover:border-${color}-500/30 transition-all duration-300`}>
            <div className={`w-10 h-10 rounded-lg bg-${color}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform text-xl`}>
                {icon}
            </div>
            <div className="text-left">
                <p className="text-white text-sm font-medium">{title}</p>
                <p className="text-white/40 text-xs">{desc}</p>
            </div>
        </Link>
    );
}
