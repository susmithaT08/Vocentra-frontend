'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Suggestion = {
    word: string;
    meaning: string;
    pronunciation: string;
    audioUrl?: string;
    partOfSpeech: string;
    difficulty: string;
    category: string;
};

type DiscoverData = {
    [category: string]: Suggestion[];
};

export default function DiscoverWords() {
    const [data, setData] = useState<DiscoverData | null>(null);
    const [loading, setLoading] = useState(true);
    const [addedWords, setAddedWords] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchDiscover = async () => {
            try {
                // Try vocentra_token first, then fallback to user string
                let token = localStorage.getItem('vocentra_token');
                if (!token) {
                    const userObj = localStorage.getItem('user');
                    token = userObj ? JSON.parse(userObj).token : '';
                }

                const headers = { 'Authorization': `Bearer ${token}` };

                const res = await fetch('/api/vocabulary/discover', { headers });
                if (res.ok) {
                    setData(await res.json());
                }
            } catch (error) {
                console.error("Failed to fetch discover words", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDiscover();
    }, []);

    const handleAddWord = async (suggestion: Suggestion) => {
        try {
            let token = localStorage.getItem('vocentra_token');
            if (!token) {
                const userObj = localStorage.getItem('user');
                token = userObj ? JSON.parse(userObj).token : '';
            }

            const res = await fetch('/api/vocabulary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(suggestion)
            });

            if (res.ok || res.status === 400) {
                // If it already exists or was added successfully, mark as added visually
                const newAdded = new Set(addedWords);
                newAdded.add(suggestion.word);
                setAddedWords(newAdded);
            }
        } catch (error) {
            console.error("Error adding word", error);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-white/20 border-t-purple-500 animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="view-content animate-slide-up pb-12">
            {/* Header Area */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/vocabulary" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </Link>
                <div>
                    <h2 className="font-display text-3xl font-semibold text-white">Discover Words</h2>
                    <p className="text-white/50 text-sm">Explore curated collections to expand your vocabulary</p>
                </div>
            </div>

            {/* Catalog Collections */}
            <div className="space-y-12">
                {data && Object.keys(data).map(category => (
                    <div key={category} className="space-y-4">
                        <div className="flex items-center gap-3 border-b border-white/10 pb-2">
                            <h3 className="text-xl font-semibold text-purple-300">{category}</h3>
                            <span className="text-xs bg-white/10 px-2 py-1 rounded text-white/50">{data[category].length} words</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {data[category].map((word) => {
                                const isAdded = addedWords.has(word.word);

                                return (
                                    <div key={word.word} className="glass-card rounded-2xl p-5 border border-white/5 hover:border-purple-500/30 transition-all flex flex-col h-full bg-black/20">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-xl font-bold text-white capitalize">{word.word}</h4>
                                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/10 text-white/60">
                                                {word.difficulty}
                                            </span>
                                        </div>
                                        {word.partOfSpeech && (
                                            <p className="text-purple-300/80 text-xs italic mb-2">{word.partOfSpeech}</p>
                                        )}
                                        <p className="text-white/70 text-sm mb-4 line-clamp-2">"{word.meaning}"</p>

                                        <div className="mt-auto pt-4 relative">
                                            <button
                                                onClick={() => handleAddWord(word)}
                                                disabled={isAdded}
                                                className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${isAdded
                                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed'
                                                    : 'bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500 hover:text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                                                    }`}
                                            >
                                                {isAdded ? '✓ Saved to Library' : '+ Add to Library'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {(!data || Object.keys(data).length === 0) && (
                    <div className="glass-card p-12 rounded-3xl text-center border-dashed border-2 border-white/10">
                        <div className="text-4xl mb-4">📚</div>
                        <h3 className="text-xl text-white font-medium mb-2">No words to discover right now.</h3>
                        <p className="text-white/50">Looks like you've added all available words to your library!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
