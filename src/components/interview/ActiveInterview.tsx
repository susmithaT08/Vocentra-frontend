'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useProgressStore } from '@/store/useProgressStore';
import { apiUrl } from '@/lib/api';

// Setup SpeechRecognition mapping for cross-browser support
let SpeechRecognition: unknown;
let SpeechGrammarList: unknown;
if (typeof window !== 'undefined') {
    SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    SpeechGrammarList = (window as any).SpeechGrammarList || (window as any).webkitSpeechGrammarList;
}

interface ActiveInterviewProps {
    token: string;
    mode: string;
    company: string;
    onComplete: (interviewId: string) => void;
    onCancel: () => void;
}

export default function ActiveInterview({ token, mode, company, onComplete, onCancel }: ActiveInterviewProps) {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<{ round: string; questionText: string; roundNumber: number; totalRounds: number } | null>(null);
    const [userTranscript, setUserTranscript] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initLoading, setInitLoading] = useState(true);

    // Web Speech API
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (SpeechRecognition) {
            recognitionRef.current = new (SpeechRecognition as new () => any)();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: unknown) => {
                const speechEvent = event as Event & {
                    resultIndex: number;
                    results: {
                        length: number;
                        [index: number]: {
                            isFinal: boolean;
                            [index: number]: { transcript: string };
                        };
                    };
                };

                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = speechEvent.resultIndex; i < speechEvent.results.length; ++i) {
                    if (speechEvent.results[i].isFinal) {
                        finalTranscript += speechEvent.results[i][0].transcript;
                    } else {
                        interimTranscript += speechEvent.results[i][0].transcript;
                    }
                }

                setUserTranscript(() => {
                    let complete = '';
                    for (let j = 0; j < speechEvent.results.length; j++) {
                        complete += speechEvent.results[j][0].transcript;
                    }
                    return complete;
                });
            };

            recognitionRef.current.onerror = (event: unknown) => {
                const errorEvent = event as Event & { error: string };
                if (errorEvent.error === 'not-allowed') {
                    console.warn("Microphone access was denied. User can continue by typing.");
                    alert("Microphone access was denied. Please allow microphone permissions in your browser, or you can continue by typing your answers.");
                } else {
                    console.error("Speech recognition error:", errorEvent.error);
                }
                setIsRecording(false);
            };

            recognitionRef.current.onend = () => {
                // If we didn't deliberately stop it, it might have timed out naturally
                setIsRecording(false);
            };
        }
    }, []);

    // 1. Start Session
    useEffect(() => {
        const startSession = async () => {
            try {
                const res = await fetch(apiUrl('/api/interview/start'), {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ mode, companySimulation: company })
                });
                if (res.ok) {
                    const data = await res.json();
                    setSessionId(data._id);
                    fetchNextQuestionLocal(data._id);
                } else {
                    alert("Failed to start session.");
                    onCancel();
                }
            } catch (err) {
                console.error(err);
                onCancel();
            }
        };
        startSession();
    }, [company, mode, token, onCancel]); // eslint-disable-line react-hooks/exhaustive-deps

    // 2. Fetch Next Question
    const fetchNextQuestionLocal = async (id: string) => {
        setInitLoading(true);
        try {
            const res = await fetch(apiUrl(`/api/interview/${id}/question`), {
                method: "POST",
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (res.status === 400 && data.message.includes("completed")) {
                // End of rounds!
                finishInterview(id);
                return;
            }

            if (res.ok) {
                setCurrentQuestion(data);
                setUserTranscript(''); // Reset for next answer

                // If it's live mode, maybe AI speaks the question here (Text-to-Speech)
                if (mode === 'LIVE' && 'speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(data.questionText);
                    utterance.rate = 0.9;
                    window.speechSynthesis.speak(utterance);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setInitLoading(false);
            setIsSubmitting(false);
        }
    };

    const toggleRecording = () => {
        if (!recognitionRef.current) {
            alert("Your browser does not support Speech Recognition. Please type your answer.");
            return;
        }

        if (isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
        } else {
            // Reset transcript purely for this session
            // Since we use the raw event results, we need to clear our state
            setUserTranscript('');
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };

    // 3. Submit Answer
    const handleSubmitAnswer = async () => {
        if (!userTranscript.trim() || !sessionId || !currentQuestion) return;

        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
        }

        setIsSubmitting(true);
        try {
            const res = await fetch(apiUrl(`/api/interview/${sessionId}/answer`), {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    questionText: currentQuestion.questionText,
                    userTranscript: userTranscript,
                    durationSeconds: 30, // Mock duration
                    round: currentQuestion.round
                })
            });

            if (res.ok) {
                // Move to next question automatically
                fetchNextQuestionLocal(sessionId);
            }
        } catch (err) {
            console.error(err);
            setIsSubmitting(false);
        }
    };

    // 4. Complete Session
    const finishInterview = async (id: string) => {
        try {
            const res = await fetch(apiUrl(`/api/interview/${id}/complete`), {
                method: "POST",
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                // Update global progress
                useProgressStore.getState().incrementMetric('career', 5);
                onComplete(id);
            }
        } catch (err) {
            console.error(err);
        }
    };


    if (initLoading && !currentQuestion) {
        return (
            <div className="w-full h-full min-h-[600px] flex flex-col items-center justify-center bg-slate-900 rounded-2xl border border-white/10 animate-pulse">
                <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-white/60">Initializing {company} AI Simulation...</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[600px] flex flex-col bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative">
            {/* Header: Progress Bar */}
            <div className="p-6 border-b border-white/10 bg-black/40 relative z-10 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">
                        {company} Mock Interview <span className="text-violet-400 text-sm ml-2 px-2 py-0.5 border border-violet-400/30 rounded-full bg-violet-400/10">{mode}</span>
                    </h2>
                    <button onClick={onCancel} className="text-sm text-red-400 hover:text-red-300 transition-colors">Abort Session</button>
                </div>

                {currentQuestion && (
                    <div>
                        <div className="flex justify-between text-xs text-white/50 mb-2 font-semibold tracking-wider uppercase">
                            <span>Round {currentQuestion.roundNumber} / {currentQuestion.totalRounds}</span>
                            <span>{currentQuestion.round} Round</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
                                style={{ width: `${(currentQuestion.roundNumber / currentQuestion.totalRounds) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Stage */}
            <div className="flex-grow p-6 flex flex-col items-center justify-center relative overflow-hidden">
                {/* Simulated Webcam UI */}
                <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>

                <div className="w-full max-w-2xl bg-black/50 border border-white/5 p-8 rounded-2xl backdrop-blur-sm z-10 text-center shadow-2xl transform transition-transform duration-500">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-violet-500/20">
                        <span className="text-3xl">🤖</span>
                    </div>

                    {isSubmitting ? (
                        <div className="py-8">
                            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-white/40">AI is analyzing your response...</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-white/50 text-sm font-medium tracking-widest uppercase mb-3">AI Interviewer</p>
                            <h3 className="text-2xl font-medium text-white/90 leading-relaxed">
                                &quot;{currentQuestion?.questionText}&quot;
                            </h3>
                        </>
                    )}
                </div>
            </div>

            {/* Interaction Footer */}
            <div className="p-6 bg-black/40 border-t border-white/10 z-10">
                <div className="max-w-3xl mx-auto flex flex-col gap-4">
                    <textarea
                        value={userTranscript}
                        onChange={(e) => setUserTranscript(e.target.value)}
                        placeholder="Your spoken transcript will appear here... (You can also type your answer)"
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 h-32 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                    ></textarea>

                    <div className="flex justify-between items-center">
                        <button
                            onClick={toggleRecording}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${isRecording ? 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse' : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'}`}
                        >
                            <span className="text-lg">{isRecording ? '⏹️' : '🎙️'}</span>
                            {isRecording ? 'Stop Recording' : 'Start Speaking'}
                        </button>

                        <button
                            onClick={handleSubmitAnswer}
                            disabled={!userTranscript.trim() || isSubmitting}
                            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
                        >
                            <span>Submit Answer</span>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
