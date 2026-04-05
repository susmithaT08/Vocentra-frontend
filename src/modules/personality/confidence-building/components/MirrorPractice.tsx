"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useConfidenceStore } from '../store/useConfidenceStore';

const SpeechRecognition = typeof window !== 'undefined' ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : null;

const PROMPTS = {
    Beginner: [
        "Introduce yourself and your top three personal strengths.",
        "Talk about a recent book or movie you enjoyed."
    ],
    Intermediate: [
        "Explain a complex topic you are passionate about as if teaching a beginner.",
        "Describe a time you overcame a difficult challenge."
    ],
    Advanced: [
        "Deliver a persuasive 60-second pitch for a new social initiative.",
        "Defend an unpopular but harmless opinion with conviction."
    ]
};

export const MirrorPractice: React.FC = () => {
    const { 
        isRecording, 
        practiceTimeRemaining, 
        recordingTranscript,
        currentDifficulty,
        latestAnalysis,
        isLoading,
        error: storeError,
        startPractice,
        stopPractice,
        setTranscript,
        decrementTimer,
        submitPracticeSession,
        resetPractice
    } = useConfidenceStore();

    const [promptText, setPromptText] = useState<string>("");
    const [localError, setLocalError] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);

    // Prompt selection effect
    useEffect(() => {
        const selectedPrompt = PROMPTS[currentDifficulty][Math.floor(Math.random() * PROMPTS[currentDifficulty].length)];
        setPromptText(selectedPrompt);
    }, [currentDifficulty, latestAnalysis]);

    // Timer and Auto-Stop effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRecording && practiceTimeRemaining > 0) {
            interval = setInterval(() => {
                decrementTimer();
            }, 1000);
        } else if (isRecording && practiceTimeRemaining === 0) {
            handleStopRecording();
        }
        return () => clearInterval(interval);
    }, [isRecording, practiceTimeRemaining, decrementTimer]);

    // Initialize Speech Recognition
    useEffect(() => {
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onresult = (event: any) => {
                let currentTranscript = '';
                for (let i = 0; i < event.results.length; i++) {
                    currentTranscript += event.results[i][0].transcript;
                }
                setTranscript(currentTranscript);
            };

            recognition.onerror = (event: any) => {
                if (event.error === 'not-allowed') {
                    setLocalError('Microphone access denied. Please allow permissions or type manually.');
                    handleStopRecording();
                }
            };

            recognitionRef.current = recognition;
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [setTranscript]);

    const handleStartRecording = async () => {
        setLocalError(null);
        try {
            // Request mic permission first
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                await navigator.mediaDevices.getUserMedia({ audio: true });
            }
            startPractice();
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.start();
                } catch (e) {
                    // Ignore already started errors
                }
            }
        } catch (err) {
            setLocalError('Microphone access is required to record voice. You can still type your response manually.');
            startPractice(); // Still start practice so user can type
        }
    };

    const handleStopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        stopPractice();
    };

    const displayError = localError || storeError;

    return (
        <div className="w-full bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mt-6 md:mt-8 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Mirror Practice</h3>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-widest tabular-nums transition-colors
                    ${isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-600'}
                `}>
                    00:{practiceTimeRemaining.toString().padStart(2, '0')}
                </span>
            </div>

            {!latestAnalysis ? (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-indigo-100">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 block">Your Prompt</span>
                        <p className="text-gray-800 font-medium text-lg leading-relaxed">"{promptText}"</p>
                    </div>

                    <div className="relative">
                        <textarea
                            className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:border-transparent focus:ring-indigo-500 transition-all min-h-[160px] resize-y text-gray-800 bg-gray-50 bg-opacity-50"
                            placeholder={isRecording ? "Listening... (or you can type your response here)" : "Type your response here or click 'Start Recording' to use voice."}
                            value={recordingTranscript}
                            onChange={(e) => {
                                // Allow manual typing anytime unless we are waiting for submission
                                setTranscript(e.target.value);
                                if (!isRecording && practiceTimeRemaining === 60) {
                                    startPractice();
                                }
                            }}
                            disabled={isLoading}
                        />
                        {isRecording && (
                            <div className="absolute top-4 right-4 flex gap-1">
                                <span className="block w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                            </div>
                        )}
                    </div>
                    
                    {displayError && (
                        <div className="text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 animate-fade-in">
                            ⚠ {displayError}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                        {!isRecording && (practiceTimeRemaining === 60 || practiceTimeRemaining === 0) ? (
                            <button
                                onClick={handleStartRecording}
                                disabled={isLoading}
                                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50"
                            >
                                Start Recording
                            </button>
                        ) : (
                            <button
                                onClick={handleStopRecording}
                                disabled={!isRecording || isLoading}
                                className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold transition shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2
                                    ${isRecording ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                                `}
                            >
                                <span className="w-3 h-3 bg-white rounded-sm hidden sm:block"></span>
                                Stop Recording
                            </button>
                        )}

                        <button
                            onClick={submitPracticeSession}
                            disabled={isLoading || recordingTranscript.trim().length === 0}
                            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold flex items-center justify-center transition-all shadow-md active:scale-95
                                ${(isLoading || recordingTranscript.trim().length === 0)
                                    ? 'bg-gray-200 text-gray-400 shadow-none cursor-not-allowed'
                                    : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg focus:ring-4 focus:ring-green-100'
                                }`}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Analyzing...
                                </span>
                            ) : 'Get Feedback'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-gray-100 pb-6">
                        <div className="text-center p-5 bg-green-50 rounded-2xl border border-green-100 min-w-[120px]">
                            <span className="block text-4xl font-black text-green-600 leading-none">{latestAnalysis.score}</span>
                            <span className="text-xs font-bold text-green-500 uppercase tracking-widest mt-2 block">Score</span>
                        </div>
                        <div className="flex-1 text-center sm:text-left mt-4 sm:mt-0">
                            <h4 className="font-bold text-gray-800 text-lg mb-2">AI Coach Assessment</h4>
                            <p className="text-gray-600 text-[15px] leading-relaxed">{latestAnalysis.feedback}</p>
                        </div>
                    </div>
                    
                    <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 flex gap-4 items-start shadow-sm">
                        <span className="text-amber-500 text-2xl drop-shadow-sm">💡</span>
                        <div className="pt-0.5">
                            <h5 className="font-bold text-amber-900 mb-1">Growth Tip</h5>
                            <p className="text-amber-800 text-[15px] leading-relaxed">{latestAnalysis.postureTip}</p>
                        </div>
                    </div>

                    <div className="flex justify-center sm:justify-end pt-4">
                        <button 
                            onClick={() => {
                                setTranscript('');
                                resetPractice();
                            }}
                            className="w-full sm:w-auto transition-all text-sm font-bold text-gray-700 hover:text-indigo-700 bg-white px-8 py-3.5 rounded-xl border border-gray-200 shadow-sm hover:border-indigo-200 hover:bg-indigo-50 active:scale-95"
                        >
                            Practice Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
