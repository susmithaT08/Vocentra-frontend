'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import SpeakingRecorder from '@/components/communication/SpeakingRecorder';
import { apiUrl } from '@/lib/api';

const SESSIONS_DATA = {
    1: { title: 'Session 1: The Introductory Pitch', objective: 'Introduce yourself naturally and confidently.', prompt: 'Tell me about yourself. Focus on your background, current role, and what you are looking for next. Aim for a 60-second response.' },
    2: { title: 'Session 2: Behavioral STAR approach', objective: 'Structure an answer using Situation, Task, Action, Result.', prompt: 'Describe a time when you had to overcome a significant challenge at work or school.' },
    3: { title: 'Session 3: Explaining a Technical Concept', objective: 'Explain a complex topic simply and clearly.', prompt: 'Explain a concept you are very familiar with to someone who has no background in it.' },
    4: { title: 'Session 4: Handling Conflict', objective: 'Demonstrate emotional intelligence and de-escalation.', prompt: 'Tell me about a time you disagreed with a colleague or manager. How did you resolve it?' },
    5: { title: 'Session 5: The "Why Us?" Question', objective: 'Show enthusiasm and company-specific alignment.', prompt: 'Why do you want to work here, and what value can you bring to our team?' },
    6: { title: 'Session 6: Pitching an Idea', objective: 'Persuade your audience with logic and passion.', prompt: 'Pitch a new project, feature, or initiative to a skeptical stakeholder.' },
    7: { title: 'Session 7: Addressing Weaknesses', objective: 'Reframe a weakness into a learning opportunity.', prompt: 'What is your greatest weakness, and how are you working to improve it?' },
    8: { title: 'Session 8: The Final Closing Statement', objective: 'End strong and leave a lasting impression.', prompt: 'Do you have any questions for us, or is there anything else you would like to add before we conclude?' },
};

type EvaluationResult = {
    metrics: {
        overallScore: number;
        pronunciationScore: number;
        fluencyScore: number;
        structureScore: number;
        confidenceScore: number;
        intonationScore: number;
    };
    wpm: number;
    fillerWordDensity: number;
    strengths: string[];
    improvementAreas: string[];
    recommendedDrill: string;
};

export default function SpeakingSessionPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const idParam = searchParams.get('id');
    const sessionId = idParam ? parseInt(idParam) : 1;

    // Fallback if invalid ID
    const sessionData = SESSIONS_DATA[sessionId as keyof typeof SESSIONS_DATA] || SESSIONS_DATA[1];

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<EvaluationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleRecordingComplete = async (audioBlob: Blob, durationSeconds: number) => {
        if (audioBlob.size === 0) {
            setError("No audio detected. Please try recording again.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const token = localStorage.getItem('vocentra_token') || localStorage.getItem('token');
            
            const formData = new FormData();
            formData.append('audio', audioBlob, 'speaking_sample.webm');
            formData.append('sessionNumber', sessionId.toString());
            formData.append('durationSeconds', durationSeconds.toString());

            const res = await fetch(apiUrl('/api/speaking/evaluate'), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}` // Let browser set Content-Type for multipart/form-data
                },
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                setResult(data.data); // data.data contains the new SpeakingSession
            } else {
                setError(data.message || 'Evaluation failed. Make sure your response is long enough and try again.');
            }
        } catch (err) {
            console.error(err);
            setError('Network error analyzing speech. Is the backend running?');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 animate-slide-up">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <Link href="/dashboard/communication/speaking" className="flex items-center gap-2 text-white/50 hover:text-white mb-4 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        <span className="text-sm">Back to Curriculum</span>
                    </Link>
                    <h2 className="font-display text-3xl font-semibold text-white mb-2">{sessionData.title}</h2>
                    <p className="text-emerald-400 font-medium">Objective: {sessionData.objective}</p>
                </div>
            </div>

            {/* Main Content Area */}
            {!result ? (
                <div className="space-y-8">
                    {/* The Prompt */}
                    <div className="glass-card rounded-2xl p-8 border-l-4 border-emerald-500 bg-emerald-500/5">
                        <h3 className="text-sm uppercase tracking-widest text-emerald-400 mb-4 font-semibold">Your Task</h3>
                        <p className="text-xl text-white/90 font-medium leading-relaxed">&quot;{sessionData.prompt}&quot;</p>
                    </div>

                    {/* The Recorder Interface */}
                    <div className="glass-card rounded-2xl p-10 flex flex-col items-center justify-center min-h-[400px]">
                        <h3 className="text-white font-medium text-lg mb-8">Click to start your response</h3>

                        {isSubmitting ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
                                <p className="text-white/70 animate-pulse">AI is analyzing your pronunciation and fluency...</p>
                            </div>
                        ) : (
                            <SpeakingRecorder onComplete={handleRecordingComplete} />
                        )}

                        {error && (
                            <div className="mt-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm max-w-lg text-center animate-shake">
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* Results View */
                <div className="space-y-6 animate-fade-in">
                    <div className="glass-card rounded-2xl p-8 bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 text-center">
                        <h3 className="text-white/60 uppercase tracking-widest text-sm mb-2">Overall Score</h3>
                        <div className="text-6xl font-display font-bold text-emerald-400 mb-2">{result.metrics.overallScore.toFixed(1)}</div>
                        <p className="text-white/80 font-medium text-lg">
                            {result.metrics.overallScore >= 8 ? "Excellent Delivery! 🎉" : result.metrics.overallScore >= 6 ? "Good job! Keep practicing. 👍" : "A good start, but needs work. 💪"}
                        </p>
                    </div>

                    <div className="glass-card rounded-2xl p-8 bg-black/20 border border-emerald-500/20 mb-6">
                        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                            <span className="text-emerald-400">📝</span> Verbatim Transcript
                        </h3>
                        <p className="text-white/80 leading-relaxed italic border-l-2 border-emerald-500/50 pl-4">{
                            // @ts-ignore
                            result.audioTranscript 
                        }</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ResultCard title="Skill Breakdown" icon="📊">
                            <div className="space-y-4">
                                <ScoreRow label="Pronunciation Accuracy" score={result.metrics.pronunciationScore} />
                                <ScoreRow label="Fluency & Pacing" score={result.metrics.fluencyScore} sub={`${result.wpm} WPM`} />
                                <ScoreRow label="Structural Coherence" score={result.metrics.structureScore} />
                                <ScoreRow label="Filler Word Control" score={10 - (result.fillerWordDensity / 2)} sub={`${result.fillerWordDensity.toFixed(1)}% density`} />
                                <ScoreRow label="Intonation" score={result.metrics.intonationScore} />
                                <ScoreRow label="Confidence Rating" score={result.metrics.confidenceScore} />
                            </div>
                        </ResultCard>

                        <div className="space-y-6">
                            <ResultCard title="Top Strengths" icon="🌟">
                                <ul className="space-y-2">
                                    {result.strengths.map((str, i) => (
                                        <li key={i} className="text-emerald-400/90 flex gap-3 text-sm">
                                            <span>✓</span> {str}
                                        </li>
                                    ))}
                                </ul>
                            </ResultCard>

                            <ResultCard title="Areas for Improvement" icon="📈">
                                <ul className="space-y-2">
                                    {result.improvementAreas.map((imp, i) => (
                                        <li key={i} className="text-amber-400/90 flex gap-3 text-sm">
                                            <span>•</span> {imp}
                                        </li>
                                    ))}
                                </ul>
                            </ResultCard>
                        </div>
                    </div>

                    <div className="glass-card rounded-2xl p-6 border border-violet-500/20">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center text-2xl shrink-0">🎯</div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Targeted Practice Drill</h3>
                                <p className="text-white/80 text-sm leading-relaxed">{result.recommendedDrill}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center mt-8">
                        <button
                            onClick={() => router.push('/dashboard/communication/speaking')}
                            className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function ResultCard({ title, icon, children }: { title: string, icon: string, children: React.ReactNode }) {
    return (
        <div className="glass-card rounded-2xl p-6 h-full">
            <h3 className="text-white font-medium mb-6 flex items-center gap-2">
                <span>{icon}</span> {title}
            </h3>
            {children}
        </div>
    );
}

function ScoreRow({ label, score, sub }: { label: string, score: number, sub?: string }) {
    return (
        <div>
            <div className="flex justify-between items-baseline mb-1">
                <span className="text-white/80 text-sm">{label}</span>
                <div className="flex items-baseline gap-2">
                    {sub && <span className="text-xs text-white/40">{sub}</span>}
                    <span className="text-white font-medium">{score.toFixed(1)}/10</span>
                </div>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.max(0, Math.min(100, score * 10))}%` }}
                ></div>
            </div>
        </div>
    );
}
