'use client';

import { useEffect, useState } from 'react';
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
    masteryStatus: string;
    srsLevel: number;
};

type PracticeMode = 'flashcard' | 'quiz' | 'fill-blank' | 'sentence' | 'pronunciation';

export default function VocabularyPractice() {
    const [reviewQueue, setReviewQueue] = useState<Word[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [completed, setCompleted] = useState(false);

    // Interactive Mode State
    const [currentMode, setCurrentMode] = useState<PracticeMode>('flashcard');
    const [isFlipped, setIsFlipped] = useState(false);
    const [quizOptions, setQuizOptions] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
    const [sentenceInput, setSentenceInput] = useState('');
    const [sentenceAssessed, setSentenceAssessed] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [pronunciationAssessed, setPronunciationAssessed] = useState(false);

    useEffect(() => {
        const fetchReviewQueue = async () => {
            try {
                const userRaw = localStorage.getItem('user');
                const tokenRaw = localStorage.getItem('token');
                
                let token = tokenRaw || '';
                if (!token && userRaw) {
                    try {
                        const userObj = JSON.parse(userRaw);
                        token = userObj.token || '';
                    } catch (e) { console.error("Could not parse user object", e); }
                }

                const headers = { 'Authorization': `Bearer ${token}` };

                const res = await fetch('/api/vocabulary/review', { headers });
                if (res.ok) {
                    setReviewQueue(await res.json());
                } else if (res.status === 401) {
                    console.error("401 Unauthorized: Session may be stale.");
                }
            } catch (error) {
                console.error("Failed to load review queue", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviewQueue();
    }, []);

    const generateOptions = (correctAnswer: string, type: 'meaning' | 'word', queue: Word[]) => {
        const options = new Set<string>();
        options.add(correctAnswer);

        // Add random distractors from queue
        const shuffledQueue = [...queue].sort(() => 0.5 - Math.random());
        for (const w of shuffledQueue) {
            if (options.size >= 4) break;
            options.add(type === 'meaning' ? w.meaning : w.word);
        }

        // Fallback distractors if queue is too small
        const fallbackMeanings = [
            'To express strong disapproval of.',
            'A sudden and unaccountable change of mood.',
            'Lacking initiative or strength of character.',
            'Keenly analytical and penetrating.',
            'Impossible to stop or prevent.',
            'Having a huge appetite.'
        ];
        const fallbackWords = ['Obfuscate', 'Capricious', 'Lethargic', 'Trenchant', 'Inexorable', 'Voracious'];

        const fallbacks = type === 'meaning' ? fallbackMeanings : fallbackWords;
        let i = 0;
        while (options.size < 4 && i < fallbacks.length) {
            options.add(fallbacks[i]);
            i++;
        }

        return Array.from(options).sort(() => 0.5 - Math.random());
    };

    const setupMode = (word: Word, queue: Word[]) => {
        setIsFlipped(false);
        setIsAnswerRevealed(false);
        setSelectedOption(null);
        setSentenceInput('');
        setSentenceAssessed(false);

        // Randomly assign a mode
        // For level 0 (new words), prioritize flashcard. 
        const modes: PracticeMode[] = ['flashcard', 'quiz', 'fill-blank', 'sentence', 'pronunciation'];
        let nextMode = modes[Math.floor(Math.random() * modes.length)];

        if (word.srsLevel === 0) nextMode = 'flashcard';
        if (nextMode === 'fill-blank' && (!word.examples || word.examples.length === 0)) nextMode = 'quiz';

        setCurrentMode(nextMode);

        if (nextMode === 'quiz') {
            setQuizOptions(generateOptions(word.meaning, 'meaning', queue));
        } else if (nextMode === 'fill-blank') {
            setQuizOptions(generateOptions(word.word, 'word', queue));
        }
    };

    // When currentIndex changes, setup the mode
    useEffect(() => {
        if (reviewQueue.length > 0 && currentIndex < reviewQueue.length) {
            setupMode(reviewQueue[currentIndex], reviewQueue);
        }
    }, [currentIndex, reviewQueue]);


    const handleOutcome = async (isCorrect: boolean) => {
        if (reviewQueue.length === 0) return;

        const currentWord = reviewQueue[currentIndex];

        try {
            const userRaw = localStorage.getItem('user');
            const tokenRaw = localStorage.getItem('token');
            
            let token = tokenRaw || '';
            if (!token && userRaw) {
                try {
                    const userObj = JSON.parse(userRaw);
                    token = userObj.token || '';
                } catch (e) { console.error("Could not parse user object", e); }
            }

            const res = await fetch(`/api/vocabulary/${currentWord._id}/progress`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isCorrect })
            });

            if (res.status === 401) {
                console.error("401 Unauthorized during progress update!");
            }

            if (isCorrect) {
                 import('@/store/useProgressStore').then(module => {
                     module.useProgressStore.getState().incrementMetric('vocabulary', 1);
                 });
            }

            // Move to next card
            if (currentIndex < reviewQueue.length - 1) {
                setTimeout(() => setCurrentIndex(prev => prev + 1), 600); // Slight delay for animation
            } else {
                setTimeout(() => setCompleted(true), 600);
            }
        } catch (error) {
            console.error("Failed to update progress", error);
        }
    };

    const handleQuizSelection = (option: string) => {
        if (isAnswerRevealed) return;
        const currentWord = reviewQueue[currentIndex];
        setSelectedOption(option);
        setIsAnswerRevealed(true);
        const isCorrect = option === currentWord.meaning;
        setTimeout(() => handleOutcome(isCorrect), 1200); // 1.2s delay to show correct/incorrect color
    };

    const handleFillBlankSelection = (option: string) => {
        if (isAnswerRevealed) return;
        const currentWord = reviewQueue[currentIndex];
        setSelectedOption(option);
        setIsAnswerRevealed(true);
        const isCorrect = option === currentWord.word;
        setTimeout(() => handleOutcome(isCorrect), 1200);
    };

    const handleSentenceSubmit = () => {
        const currentWord = reviewQueue[currentIndex];
        setSentenceAssessed(true);
        // Extremely basic client-side check just verifying the word is in the sentence
        const isCorrect = sentenceInput.toLowerCase().includes(currentWord.word.toLowerCase()) && sentenceInput.length > 10;
        setTimeout(() => handleOutcome(isCorrect), 1500);
    };

    const handlePronunciationSubmit = () => {
        setIsRecording(true);
        // Simulate a recording delay and processing time
        setTimeout(() => {
            setIsRecording(false);
            setPronunciationAssessed(true);
            setTimeout(() => handleOutcome(true), 1500); // Automatically pass after 1.5 seconds for demo
        }, 1500);
    };

    if (loading) {
        return <div className="flex h-[60vh] items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-white/20 border-t-purple-500 animate-spin"></div></div>;
    }

    const playAudio = (url: string) => {
        if (!url) return;
        const audio = new Audio(url);
        audio.play().catch(e => console.error("Audio playback failed", e));
    };

    if (reviewQueue.length === 0 || completed) {
        return (
            <div className="view-content animate-slide-up flex flex-col items-center justify-center min-h-[70vh] text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex flex-col items-center justify-center mb-6 shadow-[0_0_50px_rgba(168,85,247,0.2)]">
                    <span className="text-4xl text-purple-400">🎉</span>
                </div>
                <h2 className="font-display text-4xl font-semibold text-white mb-4">All caught up!</h2>
                <p className="text-white/60 text-lg mb-8 max-w-md">
                    You've reviewed all your due words for today. Your memory is getting stronger!
                </p>
                <div className="flex gap-4">
                    <Link href="/dashboard/vocabulary" className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-all">
                        Back to Hub
                    </Link>
                    <Link href="/dashboard/vocabulary/library" className="px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-medium shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all">
                        Browse Library
                    </Link>
                </div>
            </div>
        );
    }

    const currentWord = reviewQueue[currentIndex];
    const progressPerc = Math.round((currentIndex / reviewQueue.length) * 100);

    return (
        <div className="view-content max-w-3xl mx-auto pt-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <Link href="/dashboard/vocabulary" className="text-white/50 hover:text-white transition-colors">
                    ← End Session
                </Link>
                <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs uppercase tracking-widest flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${currentWord.masteryStatus === 'learning' ? 'bg-blue-400' : 'bg-emerald-400'}`}></div>
                        Lvl {currentWord.srsLevel}
                    </span>
                    <div className="w-32 h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full transition-all duration-300" style={{ width: `${progressPerc}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Interactive Modes Container */}
            <div className="animate-fade-in relative min-h-[400px]">

                {/* 1. Flashcard Mode */}
                {currentMode === 'flashcard' && (
                    <div className="w-full aspect-[4/3] sm:aspect-video perspective-1000 group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                        <div className={`w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                            {/* Front */}
                            <div className="absolute inset-0 backface-hidden glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center border-purple-500/20 shadow-[0_10px_40px_-10px_rgba(168,85,247,0.1)]">
                                <h2 className="text-5xl sm:text-7xl font-display font-bold text-white tracking-wide mb-4 capitalize">{currentWord.word}</h2>
                                {currentWord.pronunciation && (
                                    <div className="flex items-center gap-3">
                                        <p className="text-purple-300/60 font-mono text-lg">{currentWord.pronunciation}</p>
                                        {currentWord.audioUrl && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); playAudio(currentWord.audioUrl!); }}
                                                className="w-8 h-8 rounded-full bg-purple-500/20 hover:bg-purple-500/40 flex items-center justify-center text-purple-300 transition-colors"
                                                title="Play Pronunciation"
                                            >
                                                🔊
                                            </button>
                                        )}
                                    </div>
                                )}
                                <p className="mt-8 text-white/40 text-sm flex items-center gap-2">
                                    <span className="animate-pulse">👆</span> Tap to reveal meaning
                                </p>
                            </div>

                            {/* Back */}
                            <div className="absolute inset-0 backface-hidden rotate-y-180 glass-card rounded-3xl p-8 border-emerald-500/20 shadow-[0_10px_40px_-10px_rgba(16,185,129,0.1)] overflow-y-auto custom-scrollbar">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-3xl font-bold text-white capitalize">{currentWord.word}</h3>
                                    {currentWord.partOfSpeech && (
                                        <span className="text-xs uppercase tracking-wider px-2 py-0.5 rounded border border-white/10 text-emerald-300 italic">
                                            {currentWord.partOfSpeech}
                                        </span>
                                    )}
                                </div>
                                <p className="text-emerald-400 text-lg sm:text-x font-medium mb-6 leading-relaxed">"{currentWord.meaning}"</p>

                                {currentWord.examples?.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="text-white/40 text-xs uppercase tracking-wider mb-2">Example</h4>
                                        <p className="text-white/80 italic border-l-2 border-emerald-500/30 pl-4 py-1">"{currentWord.examples[0]}"</p>
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6 mt-auto">
                                    <div>
                                        <h4 className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Synonyms</h4>
                                        <p className="text-white/70 text-sm">{currentWord.synonyms?.join(', ') || 'None'}</p>

                                        {currentWord.antonyms && currentWord.antonyms.length > 0 && (
                                            <div className="mt-3">
                                                <h4 className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Antonyms</h4>
                                                <p className="text-white/70 text-sm">{currentWord.antonyms.join(', ')}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Context</h4>
                                        <p className="text-white/70 text-sm">{currentWord.context || 'General'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. Quiz Mode */}
                {currentMode === 'quiz' && (
                    <div className="glass-card rounded-3xl p-8 border-blue-500/20 shadow-[0_10px_40px_-10px_rgba(59,130,246,0.1)]">
                        <div className="mb-8 text-center">
                            <h4 className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2">What does this mean?</h4>
                            <h2 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-wide">{currentWord.word}</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {quizOptions.map((opt, idx) => {
                                let styleClass = "border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10";
                                if (isAnswerRevealed) {
                                    if (opt === currentWord.meaning) styleClass = "border-emerald-500 bg-emerald-500/20 text-emerald-100";
                                    else if (opt === selectedOption) styleClass = "border-rose-500 bg-rose-500/20 text-rose-100";
                                    else styleClass = "border-white/5 opacity-50";
                                }
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleQuizSelection(opt)}
                                        disabled={isAnswerRevealed}
                                        className={`p-5 rounded-2xl border text-left text-white/80 transition-all font-medium ${styleClass}`}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 3. Fill in the Blank Mode */}
                {currentMode === 'fill-blank' && (
                    <div className="glass-card rounded-3xl p-8 border-amber-500/20 shadow-[0_10px_40px_-10px_rgba(245,158,11,0.1)]">
                        <div className="mb-8">
                            <h4 className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-6 text-center">Fill in the blank</h4>
                            <p className="text-2xl sm:text-3xl text-white font-medium text-center leading-relaxed max-w-2xl mx-auto">
                                "{currentWord.examples[0].replace(new RegExp(currentWord.word, 'gi'), '_________')}"
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4">
                            {quizOptions.map((opt, idx) => {
                                let styleClass = "border-white/10 hover:border-amber-500/50 hover:bg-amber-500/10";
                                if (isAnswerRevealed) {
                                    if (opt === currentWord.word) styleClass = "border-emerald-500 bg-emerald-500/20 text-emerald-100";
                                    else if (opt === selectedOption) styleClass = "border-rose-500 bg-rose-500/20 text-rose-100";
                                    else styleClass = "border-white/5 opacity-50";
                                }
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleFillBlankSelection(opt)}
                                        disabled={isAnswerRevealed}
                                        className={`px-6 py-3 rounded-xl border text-white/90 font-bold tracking-wide transition-all ${styleClass}`}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 4. Sentence Creation Mode */}
                {currentMode === 'sentence' && (
                    <div className="glass-card rounded-3xl p-8 border-violet-500/20 shadow-[0_10px_40px_-10px_rgba(139,92,246,0.1)]">
                        <div className="mb-6 text-center">
                            <h4 className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-2">Sentence Creation</h4>
                            <p className="text-white/70">Write a sentence using the word below:</p>
                            <h2 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-wide mt-4">{currentWord.word}</h2>
                            <p className="text-emerald-400 text-sm mt-2">{currentWord.meaning}</p>
                        </div>
                        <div className="max-w-xl mx-auto">
                            <textarea
                                value={sentenceInput}
                                onChange={(e) => setSentenceInput(e.target.value)}
                                disabled={sentenceAssessed}
                                placeholder="Type your sentence here..."
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-colors resize-none h-32"
                            ></textarea>
                            {!sentenceAssessed ? (
                                <button
                                    onClick={handleSentenceSubmit}
                                    disabled={sentenceInput.length < 5}
                                    className="w-full mt-4 py-4 rounded-xl bg-violet-500 hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                                >
                                    Submit Sentence
                                </button>
                            ) : (
                                <div className={`w-full mt-4 py-4 rounded-xl text-center font-bold ${sentenceInput.toLowerCase().includes(currentWord.word.toLowerCase()) ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                                    {sentenceInput.toLowerCase().includes(currentWord.word.toLowerCase())
                                        ? "✨ Great sentence!"
                                        : `Make sure to include the word '${currentWord.word}'`}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 5. Pronunciation Mode */}
                {currentMode === 'pronunciation' && (
                    <div className="glass-card rounded-3xl p-8 border-cyan-500/20 shadow-[0_10px_40px_-10px_rgba(6,182,212,0.1)] text-center">
                        <div className="mb-8">
                            <h4 className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-2">Speak Aloud</h4>
                            <p className="text-white/70">Listen to the correct pronunciation and repeat.</p>
                            <h2 className="text-4xl sm:text-6xl font-display font-bold text-white tracking-wide mt-6 mb-4">{currentWord.word}</h2>
                            <div className="flex justify-center items-center gap-4">
                                {currentWord.pronunciation && <p className="text-cyan-300/60 font-mono text-xl">{currentWord.pronunciation}</p>}
                                {currentWord.audioUrl && (
                                    <button
                                        onClick={() => playAudio(currentWord.audioUrl!)}
                                        className="w-10 h-10 rounded-full bg-cyan-500/20 hover:bg-cyan-500/40 flex items-center justify-center text-cyan-300 transition-colors"
                                    >
                                        🔊
                                    </button>
                                )}
                            </div>
                        </div>

                        {!pronunciationAssessed ? (
                            <button
                                onClick={handlePronunciationSubmit}
                                disabled={isRecording}
                                className={`w-24 h-24 mx-auto rounded-full flex flex-col items-center justify-center transition-all ${isRecording ? 'bg-rose-500/20 border-2 border-rose-500 text-rose-400 animate-pulse' : 'bg-cyan-500/20 hover:bg-cyan-500/40 border-2 border-cyan-500 text-cyan-400 hover:scale-105'}`}
                            >
                                <span className="text-3xl mb-1">{isRecording ? '⏹️' : '🎙️'}</span>
                                <span className="text-xs font-bold uppercase">{isRecording ? 'Recording' : 'Record'}</span>
                            </button>
                        ) : (
                            <div className="w-full max-w-md mx-auto p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold flex items-center justify-center gap-3">
                                <span>✨</span>
                                Excellent Pronunciation!
                            </div>
                        )}
                    </div>
                )}


            </div>

            {/* Assessment Controls - ONLY FOR FLASHCARD MODE */}
            {currentMode === 'flashcard' && (
                <div className={`mt-12 flex justify-center gap-4 transition-all duration-500 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleOutcome(false); }}
                        className="flex-1 max-w-[200px] py-4 px-6 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-semibold transition-all hover:scale-[1.02] active:scale-95"
                    >
                        <span className="block text-xl mb-1">🤔</span>
                        Didn't know it
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleOutcome(true); }}
                        className="flex-1 max-w-[200px] py-4 px-6 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-semibold transition-all hover:scale-[1.02] active:scale-95"
                    >
                        <span className="block text-xl mb-1">💡</span>
                        Knew it
                    </button>
                </div>
            )}

            <style jsx global>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .transform-style-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
