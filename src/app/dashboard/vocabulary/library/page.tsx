'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Word = {
    _id: string;
    word: string;
    meaning: string;
    pronunciation?: string;
    audioUrl?: string;
    partOfSpeech?: string;
    synonyms?: string[];
    antonyms?: string[];
    personalNotes?: string;
    difficulty: string;
    masteryStatus: string;
    srsLevel: number;
    createdAt: string;
};

export default function VocabularyLibrary() {
    const [words, setWords] = useState<Word[]>([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [tempNote, setTempNote] = useState('');

    const playAudio = (url: string) => {
        if (!url) return;
        const audio = new Audio(url);
        audio.play().catch(e => console.error("Audio playback failed", e));
    };

    const handleSaveNote = async (id: string) => {
        try {
            let token = localStorage.getItem('vocentra_token');
            if (!token) {
                const userObj = localStorage.getItem('user');
                token = userObj ? JSON.parse(userObj).token : '';
            }
            const res = await fetch(`/api/vocabulary/${id}/notes`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ personalNotes: tempNote })
            });

            if (res.ok) {
                setWords(words.map(w => w._id === id ? { ...w, personalNotes: tempNote } : w));
                setEditingNoteId(null);
            }
        } catch (error) {
            console.error("Failed to save note", error);
        }
    };

    useEffect(() => {
        const fetchLibrary = async () => {
            try {
                const userObj = localStorage.getItem('user');
                const token = userObj ? JSON.parse(userObj).token : '';
                const headers = { 'Authorization': `Bearer ${token}` };

                const res = await fetch('/api/vocabulary', { headers });
                if (res.ok) {
                    setWords(await res.json());
                }
            } catch (error) {
                console.error("Failed to load library", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLibrary();
    }, []);

    const filteredWords = words.filter(w => {
        if (filter === 'mastered') return w.masteryStatus === 'mastered';
        if (filter === 'learning') return w.masteryStatus === 'learning';
        if (filter === 'reviewing') return w.masteryStatus === 'reviewing';
        return true; // 'all'
    });

    return (
        <div className="view-content animate-slide-up">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/vocabulary" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all">
                    ←
                </Link>
                <div>
                    <h2 className="font-display text-3xl font-semibold text-white">My Library</h2>
                    <p className="text-white/50 text-sm mt-1">{words.length} words saved</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['all', 'learning', 'reviewing', 'mastered'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize whitespace-nowrap ${filter === status
                            ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-white/20 border-t-blue-500 animate-spin"></div></div>
            ) : filteredWords.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredWords.map((item) => (
                        <div key={item._id} className="glass-card rounded-2xl p-6 border border-white/5 hover:border-blue-500/30 transition-all flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-2xl font-bold text-white tracking-wide capitalize">{item.word}</h3>
                                    {item.audioUrl && (
                                        <button
                                            onClick={() => playAudio(item.audioUrl!)}
                                            className="w-8 h-8 rounded-full bg-blue-500/10 hover:bg-blue-500/30 flex items-center justify-center text-blue-400 transition-colors"
                                            title="Play Pronunciation"
                                        >
                                            🔊
                                        </button>
                                    )}
                                </div>
                                <div className={`w-2.5 h-2.5 rounded-full mt-2 ${item.masteryStatus === 'mastered' ? 'bg-amber-400' :
                                    item.masteryStatus === 'reviewing' ? 'bg-emerald-400' : 'bg-blue-400'
                                    } shadow-[0_0_8px_currentColor]`} title={item.masteryStatus}></div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white/70">{item.difficulty || 'Beginner'}</span>
                                {item.partOfSpeech && (
                                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-white/10 text-blue-300 italic">
                                        {item.partOfSpeech}
                                    </span>
                                )}
                                {item.pronunciation && (
                                    <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 text-white/50">
                                        {item.pronunciation}
                                    </span>
                                )}
                            </div>

                            <p className="text-white/80 text-sm mb-4">"{item.meaning}"</p>

                            <div className="mt-auto space-y-2">
                                {item.synonyms && item.synonyms.length > 0 && (
                                    <p className="text-xs text-white/50"><span className="text-white/30 uppercase tracking-wider text-[10px] mr-1">Syn:</span> {item.synonyms.join(', ')}</p>
                                )}
                                {item.antonyms && item.antonyms.length > 0 && (
                                    <p className="text-xs text-white/50"><span className="text-white/30 uppercase tracking-wider text-[10px] mr-1">Ant:</span> {item.antonyms.join(', ')}</p>
                                )}

                                <div className="flex justify-between items-center text-xs mt-4 pt-4 border-t border-white/5">
                                    <span className="px-2 py-1 rounded bg-white/5 text-white/50 uppercase tracking-wider font-semibold">Lvl {item.srsLevel}</span>
                                    <span className="text-white/40">Added {new Date(item.createdAt).toLocaleDateString()}</span>
                                </div>

                                <div className="mt-4 pt-4 border-t border-white/5">
                                    {editingNoteId === item._id ? (
                                        <div className="space-y-2">
                                            <textarea
                                                value={tempNote}
                                                onChange={(e) => setTempNote(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-blue-500/50 resize-none"
                                                rows={2}
                                                placeholder="Add a personal note or mnemonic..."
                                            />
                                            <div className="flex gap-2 justify-end">
                                                <button onClick={() => setEditingNoteId(null)} className="text-xs text-white/50 hover:text-white transition-colors">Cancel</button>
                                                <button onClick={() => handleSaveNote(item._id)} className="text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white px-2 py-1 rounded transition-colors">Save</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className="group/note cursor-pointer p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all min-h-[40px]"
                                            onClick={() => {
                                                setEditingNoteId(item._id);
                                                setTempNote(item.personalNotes || '');
                                            }}
                                        >
                                            <p className="text-xs text-white/60 group-hover/note:text-white/80 line-clamp-2">
                                                {item.personalNotes ? (
                                                    <>📝 {item.personalNotes}</>
                                                ) : (
                                                    <span className="italic opacity-50">+ Add a personal memory note...</span>
                                                )}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-card rounded-2xl p-12 text-center mt-8">
                    <div className="text-4xl mb-4">📚</div>
                    <h3 className="text-xl font-semibold text-white mb-2">No words found</h3>
                    <p className="text-white/50 mb-6 max-w-md mx-auto">
                        {filter === 'all'
                            ? "Your vocabulary library is currently empty. Head back to the dashboard to find words to learn!"
                            : `You don't have any words in the "${filter}" status right now.`}
                    </p>
                    <Link href="/dashboard/vocabulary/discover" className="px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all inline-block">
                        Discover Words
                    </Link>
                </div>
            )}
        </div>
    );
}
