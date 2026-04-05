'use client';

import React, { useEffect, useState } from 'react';
import { apiUrl } from '@/lib/api';

interface InterviewDashboardProps {
    token: string;
    onStartNew: (mode: string, company: string) => void;
    onClose: () => void;
}

export default function InterviewDashboard({ token, onStartNew, onClose }: InterviewDashboardProps) {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(apiUrl('/api/interview/history'), {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setHistory(data);
                }
            } catch (error) {
                console.error("Failed to fetch history", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [token]);

    return (
        <div className="w-full h-full min-h-[600px] flex flex-col animate-fade-in bg-slate-900 border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span>👔</span> AI Mock Interviewer
                    </h2>
                    <p className="text-white/50 text-sm mt-1">Master your core skills with 4-round deep simulations.</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            <div className="p-6 flex-grow overflow-y-auto space-y-8">
                {/* Getting Started actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => onStartNew('LIVE', 'General')}
                        className="p-5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-left transition-all group"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-blue-400 text-lg group-hover:text-blue-300">Live AI Mode</h3>
                            <span className="text-xl animate-pulse">🎙️</span>
                        </div>
                        <p className="text-sm text-white/60">Real-time voice dictation with an interactive AI. Perfect for dynamic practice.</p>
                    </button>

                    <button
                        onClick={() => onStartNew('RECORDED', 'General')}
                        className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-left transition-all group"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-emerald-400 text-lg group-hover:text-emerald-300">Recorded Practice</h3>
                            <span className="text-xl">📹</span>
                        </div>
                        <p className="text-sm text-white/60">Structured typing and recording. Ideal for focusing strictly on answer formulation.</p>
                    </button>
                </div>

                {/* Company Targets */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Company-Specific Simulations</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {['Google', 'Amazon', 'Meta', 'TCS', 'Infosys'].map(company => (
                            <button
                                key={company}
                                onClick={() => onStartNew('LIVE', company)}
                                className="px-4 py-2 border border-white/10 rounded-lg whitespace-nowrap text-sm text-white/80 hover:bg-white/5 transition-colors"
                            >
                                {company} Mock
                            </button>
                        ))}
                    </div>
                </div>

                {/* History Section */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Your Progress Tracker</h3>
                    {loading ? (
                        <div className="animate-pulse bg-white/5 h-24 rounded-xl border border-white/5"></div>
                    ) : history.length === 0 ? (
                        <div className="py-8 text-center bg-white/5 rounded-xl border border-dashed border-white/10">
                            <p className="text-white/50 text-sm">No interviews recorded yet. Take your first simulation!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {history.map((session, idx) => (
                                <div key={session._id || idx} className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-white">{session.companySimulation || 'General'} Interview</h4>
                                        <p className="text-xs text-white/40 mt-1">
                                            {new Date(session.createdAt || session.date).toLocaleDateString()} • {session.mode}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        {session.status === 'COMPLETED' ? (
                                            <div className="text-emerald-400 font-bold text-lg">
                                                {session.overallMetrics?.overallScore || session.score || 0}/100
                                            </div>
                                        ) : (
                                            <span className="text-amber-400 text-xs px-2 py-1 bg-amber-400/10 rounded-full border border-amber-400/20">
                                                In Progress
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
