'use client';

import React, { useEffect, useState } from 'react';
import { apiUrl } from '@/lib/api';

interface FeedbackDashboardProps {
    token: string;
    interviewId: string;
    onClose: () => void;
}

interface InterviewData {
    companySimulation?: string;
    overallMetrics?: {
        overallScore?: number;
        communicationIndex?: number;
        technicalStrengthIndex?: number;
        leadershipReadiness?: number;
        confidenceLevel?: number;
    };
    personalizedPlan?: string;
    recommendedFocusAreas?: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    questions?: any[];
}

export default function FeedbackDashboard({ token, interviewId, onClose }: FeedbackDashboardProps) {
    const [interview, setInterview] = useState<InterviewData | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await fetch(apiUrl(`/api/interview/${interviewId}`), {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setInterview(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [interviewId, token]);

    if (loading) {
        return (
            <div className="w-full h-full min-h-[600px] flex items-center justify-center bg-slate-900 border border-white/10 rounded-2xl">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!interview) {
        return (
            <div className="w-full h-full bg-slate-900 p-8 rounded-2xl border border-rose-500/30 text-center">
                <p className="text-white mb-4">Failed to load interview analytics.</p>
                <button onClick={onClose} className="px-6 py-2 bg-white/10 rounded-lg text-white">Return</button>
            </div>
        );
    }

    const m = interview.overallMetrics || {};

    return (
        <div className="w-full h-full min-h-[600px] flex flex-col animate-fade-in bg-slate-900 border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-gradient-to-r from-emerald-500/10 to-transparent">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span>📊</span> Final Interview Analysis
                    </h2>
                    <p className="text-emerald-400 text-sm mt-1">Goal: {interview.companySimulation || 'General Role'}</p>
                </div>
                <button onClick={onClose} className="px-4 py-2 border border-white/10 rounded-lg text-white/50 hover:bg-white/5 transition-colors">Finish Review</button>
            </div>

            <div className="p-6 flex-grow overflow-y-auto space-y-8">
                {/* Score Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="col-span-2 md:col-span-1 bg-black/40 border border-emerald-500/30 rounded-xl p-4 text-center">
                        <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Overall Score</p>
                        <div className="text-4xl font-black text-emerald-400">{m.overallScore || 0}</div>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center">
                        <p className="text-white/50 text-xs uppercase mb-1">Communication</p>
                        <div className="text-2xl font-bold text-sky-400">{m.communicationIndex || 0}</div>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center">
                        <p className="text-white/50 text-xs uppercase mb-1">Technical</p>
                        <div className="text-2xl font-bold text-fuchsia-400">{m.technicalStrengthIndex || 0}</div>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center">
                        <p className="text-white/50 text-xs uppercase mb-1">Leadership</p>
                        <div className="text-2xl font-bold text-amber-400">{m.leadershipReadiness || 0}</div>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center">
                        <p className="text-white/50 text-xs uppercase mb-1">Confidence</p>
                        <div className="text-2xl font-bold text-rose-400">{m.confidenceLevel || 0}</div>
                    </div>
                </div>

                {/* AI Plan */}
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-6">
                    <h3 className="text-violet-300 font-semibold mb-2 flex items-center gap-2">
                        <span>💡</span> Personalized Preparation Plan
                    </h3>
                    <p className="text-white/80 leading-relaxed text-sm">
                        {interview.personalizedPlan || "Keep practicing your STAR formats and technical deep dives."}
                    </p>

                    {interview.recommendedFocusAreas && interview.recommendedFocusAreas.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {interview.recommendedFocusAreas.map((area: string) => (
                                <span key={area} className="px-3 py-1 bg-violet-500/20 border border-violet-500/30 rounded-full text-violet-200 text-xs">
                                    Focus: {area}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Round Breakdown */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Round Breakdown</h3>
                    <div className="space-y-4">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {interview.questions?.map((q: any, idx: number) => {
                            const isExpanded = expandedQuestion === idx;
                            return (
                                <div key={idx} className="bg-black/30 border border-white/10 rounded-xl overflow-hidden">
                                    <div
                                        className="p-4 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors"
                                        onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${q.feedback?.score >= 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                {q.feedback?.score || 0}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-white">{q.round} Round</h4>
                                                <p className="text-white/50 text-sm truncate max-w-[200px] md:max-w-md">Q: {q.questionText}</p>
                                            </div>
                                        </div>
                                        <svg className={`w-5 h-5 text-white/40 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>

                                    {isExpanded && (
                                        <div className="p-6 border-t border-white/10 bg-black/50 space-y-6">
                                            {/* Transcript */}
                                            <div>
                                                <h5 className="text-xs uppercase text-white/40 font-semibold tracking-wider mb-2">Your Answer</h5>
                                                <p className="text-white/80 p-4 bg-white/5 rounded-lg border border-white/5 text-sm italic">
                                                    "{q.userTranscript || '(No answer provided)'}"
                                                </p>
                                            </div>

                                            {/* Mistakes */}
                                            {q.feedback?.mistakes?.length > 0 && (
                                                <div>
                                                    <h5 className="text-xs uppercase text-rose-400 font-semibold tracking-wider mb-2 flex items-center gap-2">
                                                        <span>⚠️</span> Identified Mistakes
                                                    </h5>
                                                    <ul className="list-disc list-inside text-rose-200/80 text-sm space-y-1">
                                                        {(q.feedback?.mistakes || []).map((m: string, i: number) => <li key={i}>{m}</li>)}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Suggestion */}
                                            <div>
                                                <h5 className="text-xs uppercase text-sky-400 font-semibold tracking-wider mb-2 flex items-center gap-2">
                                                    <span>📈</span> Constructive Feedback
                                                </h5>
                                                <p className="text-sky-100/80 text-sm">
                                                    {q.feedback?.suggestion || "Maintain good structure."}
                                                </p>
                                            </div>

                                            {/* Better Sample */}
                                            <div>
                                                <h5 className="text-xs uppercase text-emerald-400 font-semibold tracking-wider mb-2 flex items-center gap-2">
                                                    <span>✨</span> Better Way to Answer
                                                </h5>
                                                <p className="text-emerald-100/80 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-sm border-l-4 border-l-emerald-500">
                                                    {q.feedback?.betterSample || "Use the STAR method."}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
