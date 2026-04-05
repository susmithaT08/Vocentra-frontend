'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

type Word = {
    _id: string;
    word: string;
    meaning: string;
    pronunciation: string;
    audioUrl?: string;
    partOfSpeech?: string;
    synonyms: string[];
    antonyms?: string[];
    examples: string[];
    context: string;
    contexts?: string[];
    situations?: string[];
    masteryStatus: string;
    srsLevel: number;
};

export default function VocabularyLearn() {
    const [learnQueue, setLearnQueue] = useState<Word[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [completed, setCompleted] = useState(false);
    const [step, setStep] = useState<'intro' | 'context' | 'engage' | 'committed'>('intro');
    const [engagementInput, setEngagementInput] = useState('');
    const [engagementError, setEngagementError] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchLearnQueue = async () => {
            try {
                const userObj = localStorage.getItem('user');
                const token = userObj ? JSON.parse(userObj).token : '';
                const headers = { 'Authorization': `Bearer ${token}` };

                const res = await fetch('/api/vocabulary/learn-queue', { headers });
                if (res.ok) {
                    setLearnQueue(await res.json());
                }
            } catch (error) {
                console.error("Failed to load learn queue", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLearnQueue();
    }, []);

    const playAudio = (url?: string) => {
        if (!url) return;
        const audio = new Audio(url);
        audio.play().catch(e => console.error("Audio playback failed", e));
    };

    const handleCommit = async () => {
        if (learnQueue.length === 0) return;

        const currentWord = learnQueue[currentIndex];

        try {
            const userObj = localStorage.getItem('user');
            const token = userObj ? JSON.parse(userObj).token : '';

            // Mark as correct to bump srsLevel from 0 to 1, entering the practice queue
            await fetch(`/api/vocabulary/${currentWord._id}/progress`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isCorrect: true })
            });

            setStep('committed');
            
            setTimeout(() => {
                if (currentIndex < learnQueue.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                    setStep('intro');
                    setEngagementInput('');
                } else {
                    setCompleted(true);
                }
            }, 1000);
            
        } catch (error) {
            console.error("Failed to commit word", error);
        }
    };

    const handleEngagementSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const currentWord = learnQueue[currentIndex];
        
        // Simple check: does the user input contain the word itself?
        if (engagementInput.toLowerCase().includes(currentWord.word.toLowerCase())) {
            setEngagementError(false);
            handleCommit();
        } else {
            setEngagementError(true);
        }
    };

    if (loading) {
        return <div className="flex h-[60vh] items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-white/20 border-t-amber-500 animate-spin"></div></div>;
    }

    if (learnQueue.length === 0 || completed) {
        return (
            <div className="view-content animate-slide-up flex flex-col items-center justify-center min-h-[70vh] text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex flex-col items-center justify-center mb-6 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                    <span className="text-4xl">🎓</span>
                </div>
                <h2 className="font-display text-4xl font-semibold text-white mb-4">No new words to learn!</h2>
                <p className="text-white/60 text-lg mb-8 max-w-md">
                    You've successfully learned all the words in your library. Discover more, or practice what you know!
                </p>
                <div className="flex gap-4">
                    <Link href="/dashboard/vocabulary/discover" className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-all">
                        Discover Words
                    </Link>
                    <Link href="/dashboard/vocabulary/practice" className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all">
                        Practice Now
                    </Link>
                </div>
            </div>
        );
    }

    const currentWord = learnQueue[currentIndex];
    const progressPerc = Math.round((currentIndex / learnQueue.length) * 100);

    return (
        <div className="view-content max-w-3xl mx-auto pt-8 pb-24 relative min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-12">
                <Link href="/dashboard/vocabulary" className="text-white/50 hover:text-white transition-colors flex items-center gap-2">
                    <span className="text-xl">←</span> Exit Learn Mode
                </Link>
                <div className="flex items-center gap-4">
                    <span className="text-amber-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                        <span className="text-lg">📚</span> Learning
                    </span>
                    <div className="w-32 h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${progressPerc}%` }}></div>
                    </div>
                </div>
            </div>

            <div className="relative mt-4">
                {/* Step 1: Introduction */}
                {step === 'intro' && (
                    <div className="animate-slide-up glass-card rounded-3xl p-6 md:p-10 border-amber-500/20 shadow-[0_10px_50px_-10px_rgba(245,158,11,0.15)] bg-gradient-to-b from-[#161c2d] to-[#0a0f1d] z-10 relative">
                        <div className="text-center mb-10">
                            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-widest border border-amber-500/20">Step 1: Understand</span>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center mb-10 text-center">
                            <h2 className="text-6xl md:text-7xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 mb-6 capitalize tracking-tight">
                                {currentWord.word}
                            </h2>
                            
                            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                                <span className="px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/80 italic text-lg">
                                    {currentWord.partOfSpeech || 'unknown'}
                                </span>
                                {currentWord.pronunciation && (
                                    <span className="text-amber-300/70 font-mono text-xl tracking-wider px-4 py-1.5 rounded-xl bg-amber-500/5">
                                        {currentWord.pronunciation}
                                    </span>
                                )}
                                {currentWord.audioUrl && (
                                    <button 
                                        onClick={() => playAudio(currentWord.audioUrl)}
                                        className="w-12 h-12 rounded-full bg-amber-500/20 hover:bg-amber-500/40 flex items-center justify-center text-amber-300 transition-colors shadow-glow"
                                    >
                                        <span className="text-2xl">🔊</span>
                                    </button>
                                )}
                            </div>

                            <div className="bg-black/20 p-6 rounded-2xl border-l-4 border-amber-500 w-full max-w-2xl mx-auto text-left">
                                <p className="text-white/40 uppercase tracking-widest text-xs font-bold mb-2">Meaning</p>
                                <p className="text-white text-2xl leading-relaxed font-medium">"{currentWord.meaning}"</p>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button 
                                onClick={() => setStep('context')}
                                className="px-8 py-4 rounded-xl bg-white font-bold text-black hover:bg-amber-400 transition-colors flex items-center gap-2"
                            >
                                Continue <span className="text-xl">→</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Contextualize */}
                {step === 'context' && (
                    <div className="animate-slide-up glass-card rounded-3xl p-6 md:p-10 border-blue-500/20 shadow-[0_10px_50px_-10px_rgba(59,130,246,0.15)] bg-gradient-to-b from-[#131b2f] to-[#0a0f1d] z-10 relative">
                        <div className="text-center mb-8">
                            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest border border-blue-500/20">Step 2: Contextualize</span>
                            <h3 className="text-3xl font-display font-bold text-white mt-6 capitalize">{currentWord.word}</h3>
                        </div>

                        <div className="space-y-8 mb-10 max-w-2xl mx-auto">
                            {/* Examples */}
                            {currentWord.examples && currentWord.examples.length > 0 && (
                                <div>
                                    <h4 className="text-white/40 uppercase tracking-widest text-xs font-bold mb-4">In a Sentence</h4>
                                    <div className="space-y-4">
                                        {currentWord.examples.slice(0, 2).map((ex, idx) => (
                                            <div key={idx} className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 relative overflow-hidden">
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                                                <p className="text-white/90 text-lg italic">
                                                    "{ex.split(new RegExp(`(${currentWord.word})`, 'gi')).map((part, i) => 
                                                        part.toLowerCase() === currentWord.word.toLowerCase() 
                                                            ? <span key={i} className="text-blue-400 font-bold bg-blue-500/10 px-1 rounded">{part}</span> 
                                                            : part
                                                    )}"
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tags */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {(currentWord.synonyms?.length > 0) && (
                                    <div className="p-4 rounded-xl bg-white/5">
                                        <h5 className="text-white/40 uppercase tracking-widest text-[10px] font-bold mb-2">Synonyms</h5>
                                        <p className="text-white/80">{currentWord.synonyms.join(', ')}</p>
                                    </div>
                                )}
                                {(currentWord.situations && currentWord.situations.length > 0) && (
                                    <div className="p-4 rounded-xl bg-white/5">
                                        <h5 className="text-white/40 uppercase tracking-widest text-[10px] font-bold mb-2">Situations</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {currentWord.situations.map((sit, idx) => (
                                                <span key={idx} className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs">{sit}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button 
                                onClick={() => setStep('intro')}
                                className="px-6 py-4 rounded-xl text-white/50 hover:text-white transition-colors"
                            >
                                ← Back
                            </button>
                            <button 
                                onClick={() => {
                                    setStep('engage');
                                    setTimeout(() => inputRef.current?.focus(), 100);
                                }}
                                className="px-8 py-4 rounded-xl bg-white font-bold text-black hover:bg-blue-400 transition-colors flex items-center gap-2"
                            >
                                Let's Try It <span className="text-xl">→</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Engage */}
                {step === 'engage' && (
                    <div className="animate-slide-up glass-card rounded-3xl p-6 md:p-10 border-emerald-500/20 shadow-[0_10px_50px_-10px_rgba(16,185,129,0.15)] bg-gradient-to-b from-[#10241d] to-[#0a0f1d] z-10 relative">
                        <div className="text-center mb-10">
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-widest border border-emerald-500/20">Step 3: Reinforce</span>
                        </div>
                        
                        <div className="max-w-xl mx-auto text-center mb-10">
                            <h3 className="text-2xl text-white mb-6 leading-relaxed">
                                To commit <strong className="text-emerald-400 text-3xl mx-2 capitalize">{currentWord.word}</strong> to memory, type it out once below.
                            </h3>
                            
                            <form onSubmit={handleEngagementSubmit} className="relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={engagementInput}
                                    onChange={(e) => {
                                        setEngagementInput(e.target.value);
                                        setEngagementError(false);
                                    }}
                                    placeholder={`Type "${currentWord.word}"`}
                                    className={`w-full bg-black/40 border-2 rounded-2xl p-6 text-2xl text-center text-white placeholder-white/20 focus:outline-none transition-all ${
                                        engagementError ? 'border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)] bg-rose-500/5' : 'border-emerald-500/30 focus:border-emerald-500 focus:shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                                    }`}
                                />
                                {engagementError && (
                                    <p className="text-rose-400 text-sm mt-3 animate-pulse">Oops! Make sure to type exactly "{currentWord.word}" to move on.</p>
                                )}
                            </form>
                        </div>

                        <div className="flex justify-between items-center">
                            <button 
                                onClick={() => {
                                    setStep('context');
                                    setEngagementError(false);
                                }}
                                className="px-6 py-4 rounded-xl text-white/50 hover:text-white transition-colors"
                            >
                                ← Review Meaning
                            </button>
                            <button 
                                onClick={handleEngagementSubmit}
                                disabled={engagementInput.length < 2}
                                className="px-10 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:bg-white/10 text-white font-bold transition-all shadow-glow"
                            >
                                Master Word ✨
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Committed Success */}
                {step === 'committed' && (
                    <div className="animate-fade-in absolute inset-0 z-10 glass-card rounded-3xl p-10 flex flex-col items-center justify-center text-center bg-[#0a0f1d]/90 backdrop-blur-xl border border-emerald-500/30">
                        <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex flex-col items-center justify-center mb-6 shadow-[0_0_50px_rgba(16,185,129,0.3)] border-2 border-emerald-400 animate-bounce">
                            <span className="text-4xl">✨</span>
                        </div>
                        <h3 className="text-4xl font-display font-bold text-white mb-2">Word Learned!</h3>
                        <p className="text-emerald-400 text-xl font-medium mb-2 capitalize">{currentWord.word}</p>
                        <p className="text-white/50">This word has been added to your Practice queue.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
