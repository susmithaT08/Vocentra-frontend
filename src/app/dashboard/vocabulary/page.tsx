'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type VocabularyAnalytics = {
    totalWords: number;
    masteredWords: number;
    learningWords: number;
    reviewingWords: number;
    longestStreak: number;
    newWordsThisWeek: number;
    masteryPercentage: number;
    learningLevel: string;
    score: number;
    levelProgress: number;
};

type Suggestion = {
    word: string;
    meaning: string;
    pronunciation: string;
    audioUrl?: string;
    partOfSpeech: string;
    synonyms?: string[];
    antonyms?: string[];
    examples?: string[];
    context?: string;
    contexts?: string[];
    situations?: string[];
    difficulty: string;
};

export default function VocabularyDashboard() {
    const [analytics, setAnalytics] = useState<VocabularyAnalytics | null>(null);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const userObj = localStorage.getItem('user');
                const token = userObj ? JSON.parse(userObj).token : '';

                const headers = { 'Authorization': `Bearer ${token}` };

                const [analyticsRes, suggestionsRes] = await Promise.all([
                    fetch('/api/vocabulary/analytics', { headers }),
                    fetch('/api/vocabulary/suggestions', { headers })
                ]);

                if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
                if (suggestionsRes.ok) setSuggestions(await suggestionsRes.json());
            } catch (error) {
                console.error("Failed to fetch vocabulary dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleAddWord = async (suggestion: Suggestion) => {
        try {
            const userObj = localStorage.getItem('user');
            const token = userObj ? JSON.parse(userObj).token : '';
            const res = await fetch('/api/vocabulary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(suggestion)
            });
            if (res.ok) {
                setSuggestions(prev => prev.filter(s => s.word !== suggestion.word));
                if (analytics) {
                    setAnalytics({
                        ...analytics,
                        totalWords: analytics.totalWords + 1,
                        learningWords: analytics.learningWords + 1,
                        newWordsThisWeek: analytics.newWordsThisWeek + 1,
                        score: analytics.score + 2 // Assuming learning adds 2 pts
                    });
                }
            }
        } catch (error) {
            console.error("Error adding word", error);
        }
    };

    const playAudio = (url?: string) => {
        // Mocking audio play action
        if (url) {
            console.log("Playing audio:", url);
        } else {
            console.log("No audio available");
        }
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-purple-500 border-b-transparent border-l-transparent animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-4 border-l-blue-400 border-b-emerald-400 border-t-transparent border-r-transparent animate-spin-reverse delay-150"></div>
                </div>
            </div>
        );
    }

    const { learningLevel = 'Beginner', levelProgress = 0, score = 0 } = analytics || {};

    // Get color theme based on level
    const getLevelColors = (level: string) => {
        switch (level) {
            case 'Master': return 'from-amber-400 to-orange-600 shadow-[0_0_30px_rgba(245,158,11,0.4)] border-amber-500/50';
            case 'Advanced': return 'from-purple-500 to-pink-600 shadow-[0_0_30px_rgba(168,85,247,0.4)] border-purple-500/50';
            case 'Intermediate': return 'from-blue-400 to-indigo-600 shadow-[0_0_30px_rgba(59,130,246,0.4)] border-blue-500/50';
            default: return 'from-emerald-400 to-teal-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] border-emerald-500/50';
        }
    };

    return (
        <div className="view-content animate-slide-up pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-2xl rounded-full"></div>
                    <h2 className="relative font-display text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70 mb-2">
                        Vocabulary Builder
                    </h2>
                    <p className="text-white/60 text-lg flex items-center gap-2">
                        Master your words, shape your world. ✨
                    </p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <Link href="/dashboard/vocabulary/discover" className="group relative px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <span className="text-xl">🔍</span>
                        <span className="text-white font-medium">Discover</span>
                    </Link>
                    <Link href="/dashboard/vocabulary/library" className="group relative px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <span className="text-xl">📚</span>
                        <span className="text-white font-medium">Library</span>
                    </Link>
                    <Link href="/dashboard/vocabulary/practice" className="relative px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold tracking-wide hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all overflow-hidden group">
                        <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300"></div>
                        <span className="relative z-10 flex items-center gap-2">
                            <span>🎮</span> Practice Now
                        </span>
                    </Link>
                </div>
            </div>

            {/* Level & Stats Gamification */}
            <div className={`relative w-full rounded-3xl p-8 mb-10 overflow-hidden border ${getLevelColors(learningLevel).split(' ').find(c => c.startsWith('border-'))} bg-[#0a0f1d]/80 backdrop-blur-xl`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-[100px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 blur-[80px] rounded-full pointer-events-none"></div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                    {/* User Level Card */}
                    <div className="col-span-1 lg:col-span-5 flex flex-col items-center justify-center p-6 border-r border-white/5">
                        <div className="relative w-40 h-40 mb-4 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" className="stroke-white/10" strokeWidth="6" />
                                <circle 
                                    cx="50" cy="50" r="45" fill="none" 
                                    className={`stroke-current ${learningLevel === 'Master' ? 'text-amber-500' : learningLevel === 'Advanced' ? 'text-purple-500' : learningLevel === 'Intermediate' ? 'text-blue-500' : 'text-emerald-500'}`} 
                                    strokeWidth="6" strokeLinecap="round" strokeDasharray="283" strokeDashoffset={283 - (283 * levelProgress) / 100}
                                    style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }}
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center text-center">
                                <span className={`text-4xl shadow-glow ${learningLevel === 'Master' ? 'text-amber-400' : learningLevel === 'Advanced' ? 'text-purple-400' : learningLevel === 'Intermediate' ? 'text-blue-400' : 'text-emerald-400'}`}>
                                    {learningLevel === 'Master' ? '👑' : learningLevel === 'Advanced' ? '🚀' : learningLevel === 'Intermediate' ? '🔥' : '🌱'}
                                </span>
                                <span className="font-bold text-xl text-white mt-1">{learningLevel}</span>
                            </div>
                        </div>
                        <div className="text-center w-full">
                            <p className="text-white/60 text-sm mb-2">{score} XP Earned</p>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className={`h-full bg-gradient-to-r ${getLevelColors(learningLevel).split(' ')[0]} ${getLevelColors(learningLevel).split(' ')[1]}`} style={{ width: `${levelProgress}%` }}></div>
                            </div>
                            <p className="text-white/50 text-xs mt-2 italic">"{learningLevel === 'Master' ? 'You are a vocabulary legend!' : 'Keep learning to level up'}"</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="col-span-1 lg:col-span-7 grid grid-cols-2 gap-4">
                        <StatBox label="Total Words" value={analytics?.totalWords || 0} icon="📚" color="blue" subtitle={`+${analytics?.newWordsThisWeek || 0} this week`} />
                        <StatBox label="Learning" value={analytics?.learningWords || 0} icon="🧠" color="emerald" subtitle="Active retention" />
                        <StatBox label="Mastered" value={analytics?.masteredWords || 0} icon="⭐" color="amber" subtitle={`${analytics?.masteryPercentage || 0}% completion`} />
                        <StatBox label="Daily Streak" value={analytics?.longestStreak || 0} icon="🔥" color="rose" subtitle="Keep it up!" />
                    </div>
                </div>
            </div>

            {/* Word Learning Section */}
            <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="bg-blue-500/20 text-blue-400 p-2 rounded-xl">✨</span> Daily Word Discoveries
                        </h3>
                        <p className="text-white/50 text-sm mt-1">Curated suggestions for your learning level</p>
                    </div>
                </div>

                {suggestions.length > 0 ? (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {suggestions.map((s, i) => (
                            <div key={i} className="group relative bg-[#131b2f] rounded-3xl border border-white/5 hover:border-blue-500/30 overflow-hidden transition-all hover:bg-[#161f36]">
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <div className="flex items-center gap-4 mb-2">
                                                <h4 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 capitalize">
                                                    {s.word}
                                                </h4>
                                                <button onClick={() => playAudio(s.audioUrl)} className="w-10 h-10 rounded-full bg-white/5 hover:bg-blue-500/20 text-white/70 hover:text-blue-400 flex items-center justify-center transition-all border border-white/10">
                                                    🔊
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm italic">
                                                    {s.partOfSpeech}
                                                </span>
                                                <span className="text-white/50 font-mono tracking-widest text-sm">
                                                    {s.pronunciation}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleAddWord(s)}
                                            className="px-5 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500/30 transition-all font-semibold flex items-center gap-2"
                                        >
                                            <span className="text-lg">+</span> Save Word
                                        </button>
                                    </div>

                                    <div className="mb-6">
                                        <h5 className="text-white/40 uppercase tracking-widest text-[10px] font-bold mb-2">Meaning</h5>
                                        <p className="text-white/90 text-lg leading-relaxed">{s.meaning}</p>
                                    </div>

                                    {s.examples && s.examples.length > 0 && (
                                        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 relative overflow-hidden">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500/50"></div>
                                            <h5 className="text-emerald-400/60 uppercase tracking-widest text-[10px] font-bold mb-2">In a Sentence</h5>
                                            <p className="text-white/80 italic">"{s.examples[0]}"</p>
                                        </div>
                                    )}

                                    {/* Contexts & Situations Tags */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {(s.contexts && s.contexts.length > 0) && (
                                            <div>
                                                <h5 className="text-white/40 uppercase tracking-widest text-[10px] font-bold mb-2">Contexts</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {s.contexts.map((ctx, idx) => (
                                                        <span key={idx} className="px-2 py-1 rounded-lg bg-purple-500/10 text-purple-300 text-xs border border-purple-500/20">
                                                            {ctx}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {(s.situations && s.situations.length > 0) ? (
                                            <div>
                                                <h5 className="text-white/40 uppercase tracking-widest text-[10px] font-bold mb-2">Real-life Situations</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {s.situations.map((sit, idx) => (
                                                        <span key={idx} className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-300 text-xs border border-amber-500/20">
                                                            🤝 {sit}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                 <h5 className="text-white/40 uppercase tracking-widest text-[10px] font-bold mb-2">Real-life Situations</h5>
                                                 <span className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-300 text-xs border border-amber-500/20">
                                                    🤝 Casual Conversation
                                                 </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center justify-center p-16 rounded-3xl bg-[#131b2f] border border-white/5 border-dashed">
                        <span className="text-6xl mb-4">🏆</span>
                        <h4 className="text-xl font-bold text-white mb-2">All Caught Up!</h4>
                        <p className="text-white/50 text-center max-w-sm">You\'ve added all suggested words for today. Great job expanding your vocabulary!</p>
                        <Link href="/dashboard/vocabulary/discover" className="mt-6 px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors">
                            Discover More Words
                        </Link>
                    </div>
                )}
            </div>

             {/* Quick Actions / Practice Promos */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 md:col-span-2 rounded-3xl p-8 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] group-hover:bg-blue-500/20 transition-all duration-700"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4 inline-block">Interactive Learning</span>
                            <h3 className="text-2xl font-bold text-white mb-2">Master Words Faster</h3>
                            <p className="text-white/60 mb-6 max-w-md">Engage with spaced repetition flashcards, fill-in-the-blank sentences, and situational conversations.</p>
                        </div>
                        <div className="flex gap-4 self-start mt-2">
                            <Link href="/dashboard/vocabulary/learn" className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.4)] text-white font-medium transition-all">
                                Learn New Words
                            </Link>
                            <Link href="/dashboard/vocabulary/practice" className="px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.4)] text-white font-medium transition-all">
                                Practice Mastery
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl p-8 bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border border-emerald-500/20 flex flex-col justify-center items-center text-center group">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                        📝
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Needs Review</h3>
                    <p className="text-white/60 text-sm mb-4">You have <strong className="text-emerald-400">{analytics?.reviewingWords || 0}</strong> words ready for review today.</p>
                    <Link href="/dashboard/vocabulary/practice?mode=review" className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors flex items-center gap-1">
                        Review Now <span>→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function StatBox({ label, value, icon, color, subtitle }: { label: string, value: number, icon: string, color: string, subtitle: string }) {
    const bgColors: Record<string, string> = {
        'blue': 'bg-blue-500/10 border-blue-500/20',
        'emerald': 'bg-emerald-500/10 border-emerald-500/20',
        'amber': 'bg-amber-500/10 border-amber-500/20',
        'rose': 'bg-rose-500/10 border-rose-500/20',
    };

    const textColors: Record<string, string> = {
        'blue': 'text-blue-400',
        'emerald': 'text-emerald-400',
        'amber': 'text-amber-400',
        'rose': 'text-rose-400',
    };

    return (
        <div className={`p-5 rounded-2xl border ${bgColors[color]} flex flex-col justify-between hover:bg-white/5 transition-colors`}>
            <div className="flex justify-between items-start mb-4">
                <span className="text-2xl">{icon}</span>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${textColors[color]}`}>{label}</span>
            </div>
            <div>
                <h4 className="text-3xl font-bold text-white mb-1">{value}</h4>
                <p className="text-white/40 text-xs">{subtitle}</p>
            </div>
        </div>
    );
}
