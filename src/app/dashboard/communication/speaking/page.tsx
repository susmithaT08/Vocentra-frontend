'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiUrl } from '@/lib/api';

type Session = {
    _id: string;
    sessionNumber: number;
    metrics: {
        overallScore: number;
        pronunciationScore: number;
        fluencyScore: number;
        structureScore: number;
        confidenceScore: number;
        intonationScore: number;
    };
    strengths?: string[];
    improvementAreas?: string[];
    date: string;
};

const SESSIONS_DATA = [
    { id: 1, title: 'Session 1: The Introductory Pitch', objective: 'Introduce yourself naturally and confidently.' },
    { id: 2, title: 'Session 2: Behavioral STAR approach', objective: 'Structure an answer using Situation, Task, Action, Result.' },
    { id: 3, title: 'Session 3: Explaining a Technical Concept', objective: 'Explain a complex topic simply and clearly.' },
    { id: 4, title: 'Session 4: Handling Conflict', objective: 'Demonstrate emotional intelligence and de-escalation.' },
    { id: 5, title: 'Session 5: The "Why Us?" Question', objective: 'Show enthusiasm and company-specific alignment.' },
    { id: 6, title: 'Session 6: Pitching an Idea', objective: 'Persuade your audience with logic and passion.' },
    { id: 7, title: 'Session 7: Addressing Weaknesses', objective: 'Reframe a weakness into a learning opportunity.' },
    { id: 8, title: 'Session 8: The Final Closing Statement', objective: 'End strong and leave a lasting impression.' },
];

export default function SpeakingDashboard() {
    const [history, setHistory] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(apiUrl('/api/speaking/progress'));
                if (res.ok) {
                    const data = await res.json();
                    setHistory(data.data || []);
                }
            } catch (error) {
                console.error("Failed to fetch speaking history:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const latestSession = history.length > 0 ? history[history.length - 1] : null;
    const firstSession = history.length > 0 ? history[0] : null;

    // Calculate aggregate scores from history or show 0
    const overallAvg = history.length > 0
        ? Math.round(history.reduce((acc, curr) => acc + curr.metrics.overallScore, 0) / history.length * 10) / 10
        : 0;

    return (
        <div className="animate-slide-up">
            <div className="mb-8">
                <Link href="/dashboard/communication" className="flex items-center gap-2 text-white/50 hover:text-white mb-4 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    <span className="text-sm">Back to Language & Communication</span>
                </Link>
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-2xl">🎤</div>
                    <h2 className="font-display text-3xl font-semibold text-white">Speaking Practice</h2>
                </div>
                <p className="text-white/50">AI-powered pronunciation and fluency training program</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div></div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Stats & Progress */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="glass-card rounded-2xl p-6 border border-emerald-500/20 bg-emerald-500/5">
                            <h3 className="text-white font-medium mb-4">Overall Speaking Score</h3>
                            <div className="flex items-end gap-2 mb-6">
                                <span className="text-5xl font-display font-bold text-emerald-400">{overallAvg.toFixed(1)}</span>
                                <span className="text-white/40 mb-1">/ 10</span>
                            </div>

                            <div className="space-y-4">
                                <ScoreBar label="Pronunciation" score={latestSession?.metrics.pronunciationScore || 0} color="emerald" />
                                <ScoreBar label="Fluency & WPM" score={latestSession?.metrics.fluencyScore || 0} color="blue" />
                                <ScoreBar label="Structure" score={latestSession?.metrics.structureScore || 0} color="purple" />
                                <ScoreBar label="Confidence" score={latestSession?.metrics.confidenceScore || 0} color="amber" />
                            </div>
                        </div>

                        {/* Progress Graph Mockup */}
                        <div className="glass-card rounded-2xl p-6">
                            <h3 className="text-white font-medium mb-4">Progress Tracker</h3>
                            {history.length >= 2 ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/50">First Session</span>
                                        <span className="text-white">{firstSession?.metrics.overallScore.toFixed(1)}/10</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/50">Latest Session</span>
                                        <span className="text-emerald-400">{latestSession?.metrics.overallScore.toFixed(1)}/10</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden flex">
                                        <div className="bg-white/20 h-full" style={{ width: `${(firstSession?.metrics.overallScore || 0) * 10}%` }}></div>
                                        <div className="bg-emerald-500 h-full" style={{ width: `${((latestSession?.metrics.overallScore || 0) - (firstSession?.metrics.overallScore || 0)) * 10}%` }}></div>
                                    </div>
                                    <p className="text-xs text-emerald-400/80 mt-2">
                                        +{(latestSession!.metrics.overallScore - firstSession!.metrics.overallScore).toFixed(1)} points improvement!
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-white/40 italic">Complete at least 2 sessions to see your progress comparison.</p>
                            )}
                        </div>

                        {/* AI Insights (from latest session) */}
                        {latestSession && (
                            <div className="glass-card rounded-2xl p-6">
                                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                                    <span className="text-xl">💡</span> Latest Insights
                                </h3>
                                <div className="mb-4">
                                    <h4 className="text-xs text-white/40 uppercase tracking-widest mb-2">Strengths</h4>
                                    <ul className="space-y-1">
                                        {latestSession.strengths?.map((str, i) => (
                                            <li key={i} className="text-sm text-emerald-400/90 flex gap-2">
                                                <span>✓</span> {str}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xs text-white/40 uppercase tracking-widest mb-2">Focus Areas</h4>
                                    <ul className="space-y-1">
                                        {latestSession.improvementAreas?.map((imp, i) => (
                                            <li key={i} className="text-sm text-amber-400/90 flex gap-2">
                                                <span>•</span> {imp}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Sessions List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                            Curriculum <span className="text-xs py-1 px-2 rounded-md bg-white/10 text-white/60">8 Sessions</span>
                        </h3>

                        {SESSIONS_DATA.map((session) => {
                            // Check if this session appears in history
                            const completedSession = history.find(h => h.sessionNumber === session.id);

                            return (
                                <Link
                                    href={`/dashboard/communication/speaking/session?id=${session.id}`}
                                    key={session.id}
                                    className="block glass-card rounded-2xl p-5 hover:bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all group"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-white font-medium group-hover:text-emerald-400 transition-colors">{session.title}</h4>
                                                {completedSession && (
                                                    <span className="bg-emerald-500/20 text-emerald-400 text-xs py-0.5 px-2 rounded-full">Completed</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-white/50">{session.objective}</p>
                                        </div>

                                        {completedSession ? (
                                            <div className="text-right">
                                                <div className="text-xl font-semibold text-emerald-400">{completedSession.metrics.overallScore.toFixed(1)}</div>
                                                <div className="text-xs text-white/40">Score</div>
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

function ScoreBar({ label, score, color }: { label: string, score: number, color: string }) {
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="text-white/60">{label}</span>
                <span className="text-white">{score.toFixed(1)}</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                    className={`h-full bg-${color}-500 rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${score * 10}%` }}
                ></div>
            </div>
        </div>
    );
}
