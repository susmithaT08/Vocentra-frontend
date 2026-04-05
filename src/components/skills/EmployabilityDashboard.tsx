'use client';

import React, { useEffect, useState } from 'react';
import { apiUrl } from '@/lib/api';

interface EmployabilityDashboardProps {
    token: string;
    onClose: () => void;
}

export default function EmployabilityDashboard({ token, onClose }: EmployabilityDashboardProps) {
    const [engineData, setEngineData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const res = await fetch(apiUrl('/api/skills/analyze'), {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || 'Failed to fetch analysis');
                }

                setEngineData(data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchAnalysis();
    }, [token]);

    if (loading) {
        return (
            <div className="w-full min-h-[700px] flex items-center justify-center bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-500/20 rounded-full blur-[80px] animate-pulse"></div>
                <div className="text-center relative z-10">
                    <div className="w-20 h-20 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-6 shadow-[0_0_30px_rgba(139,92,246,0.3)]"></div>
                    <p className="text-white/70 font-display text-lg tracking-wide animate-pulse">Initializing Intelligence Core...</p>
                </div>
            </div>
        );
    }

    if (error || !engineData) {
        return (
            <div className="w-full min-h-[700px] bg-black/40 backdrop-blur-2xl p-8 rounded-3xl border border-rose-500/30 text-center flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-rose-500/5"></div>
                <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/20 rounded-full flex justify-center items-center mb-6 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
                    <svg className="w-10 h-10 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 font-display tracking-wide">Engine Unavailable</h3>
                <p className="text-white/60 mb-8 max-w-md text-sm leading-relaxed">{error || "Critical data missing from neural pathway."}</p>
                <button onClick={onClose} className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white transition-all hover:-translate-y-0.5 shadow-lg">Return to Terminal</button>
            </div>
        );
    }

    const {
        overall_employability_score,
        employability_level,
        categorized_skill_indexes,
        job_eligibility_matching,
        strengths,
        improvement_areas,
        career_direction_recommendation,
        action_plan
    } = engineData;

    return (
        <div className="w-full h-full min-h-[800px] flex flex-col animate-fade-in glass-card bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative">

            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>

            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-white/10 bg-gradient-to-r from-black/40 to-transparent flex flex-col sm:flex-row justify-between items-start sm:items-center relative z-20 gap-4">
                <div className="flex flex-row items-center gap-4">
                    <div className="w-12 h-12 bg-violet-500/10 border border-violet-500/30 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                        <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-display font-bold text-white tracking-tight">Vocentra Intelligence Core</h2>
                        <p className="text-violet-300/70 text-sm mt-0.5">AI-Powered Career & Eligibility Mapping</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 shadow-lg ${isEditing ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-white/5 border border-white/10 text-white hover:bg-white/15 hover:-translate-y-0.5'}`}
                    >
                        {isEditing ? (
                            <>Save Adjustments <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg></>
                        ) : (
                            <>Override Metrics <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></>
                        )}
                    </button>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center border border-white/10 bg-white/5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            </div>

            <div className={`absolute top-[88px] left-0 w-full h-[2px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 transition-all duration-300 ${updateLoading ? 'opacity-100 shadow-[0_0_10px_rgba(139,92,246,0.8)]' : 'opacity-0'}`}>
                {updateLoading && <div className="absolute top-0 left-0 h-full w-1/3 bg-white/50 animate-[slide_1s_infinite_linear]"></div>}
            </div>

            <div className="p-6 sm:p-8 flex-grow overflow-y-auto space-y-10 z-10 custom-scrollbar">

                {/* Top Insight Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="col-span-1 bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-[40px] rounded-full group-hover:bg-violet-500/20 transition-all duration-500"></div>
                        <div className="w-32 h-32 relative flex items-center justify-center mb-6">
                            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path className="text-white/5" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="currentColor" strokeWidth="2" fill="none" />
                                <path className={`text-${overall_employability_score >= 80 ? 'emerald' : overall_employability_score >= 60 ? 'amber' : 'rose'}-500 transition-all duration-1000 ease-out`} strokeDasharray={`${overall_employability_score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                            </svg>
                            <div className="text-4xl font-display font-black text-white glow-text">{overall_employability_score}</div>
                        </div>
                        <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 font-bold mb-3">Overall Profile Metric</h3>
                        <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-[0_0_10px_rgba(255,255,255,0.05)] ${overall_employability_score >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10' :
                            overall_employability_score >= 60 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/10' :
                                'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-500/10'
                            }`}>
                            {employability_level}
                        </div>
                    </div>

                    <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-white/5 border border-emerald-500/10 hover:border-emerald-500/30 rounded-3xl p-6 transition-colors group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[40px] rounded-full group-hover:bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 border border-emerald-500/20 relative z-10">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            </div>
                            <h4 className="text-white font-display font-semibold mb-3 relative z-10">Core Strengths</h4>
                            <ul className="space-y-3 relative z-10">
                                {(strengths || []).slice(0, 3).map((s: string, i: number) => (
                                    <li key={i} className="text-white/60 text-sm flex items-start gap-3 group-hover:text-white/80 transition-colors">
                                        <span className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold">✓</span>
                                        <span className="leading-relaxed">{s}</span>
                                    </li>
                                ))}
                                {(!strengths || strengths.length === 0) && <p className="text-white/30 text-sm italic py-2">Insufficient dataset. Engage in mock interviews.</p>}
                            </ul>
                        </div>

                        <div className="bg-white/5 border border-rose-500/10 hover:border-rose-500/30 rounded-3xl p-6 transition-colors group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-[40px] rounded-full group-hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                            <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center mb-4 border border-rose-500/20 relative z-10">
                                <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                            </div>
                            <h4 className="text-white font-display font-semibold mb-3 relative z-10">Focus Areas</h4>
                            <ul className="space-y-3 relative z-10">
                                {(improvement_areas || []).slice(0, 3).map((s: string, i: number) => (
                                    <li key={i} className="text-white/60 text-sm flex items-start gap-3 group-hover:text-white/80 transition-colors">
                                        <span className="w-5 h-5 rounded bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold">!</span>
                                        <span className="leading-relaxed">{s}</span>
                                    </li>
                                ))}
                                {(!improvement_areas || improvement_areas.length === 0) && <p className="text-white/30 text-sm italic py-2">No critical gaps identified at this profile level.</p>}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Deep Dive Skill Indexes */}
                <div>
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h3 className="text-xl font-display font-bold text-white tracking-wide">Competency Matrix</h3>
                            <p className="text-sm text-white/50 mt-1">Multi-dimensional analysis of your core traits.</p>
                        </div>
                        {isEditing && <span className="px-3 py-1 bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse shadow-[0_0_15px_rgba(139,92,246,0.2)]">Edit Mode Active</span>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {[
                            { id: 'communication_skills', title: 'Communication & Verbal', data: categorized_skill_indexes.communication_skills, color: 'sky' },
                            { id: 'technical_skills', title: 'Technical & Domain', data: categorized_skill_indexes.technical_skills, color: 'fuchsia' },
                            { id: 'behavioral_skills', title: 'Behavioral & Scenario', data: categorized_skill_indexes.behavioral_skills, color: 'amber' },
                            { id: 'cognitive_skills', title: 'Cognitive & Solving', data: categorized_skill_indexes.cognitive_skills, color: 'indigo' },
                            { id: 'professional_readiness', title: 'Professional Readiness', data: categorized_skill_indexes.professional_readiness, color: 'emerald' },
                        ].map((cat, idx) => (
                            <div key={idx} className={`bg-white/5 border border-white/10 rounded-3xl p-6 transition-all duration-300 relative overflow-hidden group hover:bg-white/10 ${isEditing ? 'ring-2 ring-indigo-500/50 scale-[1.02] shadow-[0_0_30px_rgba(99,102,241,0.15)]' : ''}`}>

                                <div className={`absolute top-0 right-0 w-40 h-40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0`} style={{ background: `radial-gradient(circle, var(--tw-color-${cat.color}-500) 0%, transparent 70%)` }}></div>

                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div>
                                        <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                                            {cat.title}
                                        </h4>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border bg-${cat.color}-500/10 text-${cat.color}-400 border-${cat.color}-500/20`}>
                                            {cat.data?.level || 'Unknown Status'}
                                        </span>
                                    </div>
                                    {!isEditing ? (
                                        <div className={`text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-${cat.color}-400`}>
                                            {cat.data?.score || 0}
                                        </div>
                                    ) : (
                                        <div className="w-24 shrink-0 flex flex-col items-end">
                                            <div className={`text-2xl font-black text-${cat.color}-400 mb-2`}>{cat.data?.score || 0}</div>
                                            <input
                                                type="range"
                                                min="0" max="100"
                                                value={cat.data?.score || 0}
                                                onChange={async (e) => {
                                                    const newScore = e.target.value;
                                                    setUpdateLoading(true);
                                                    try {
                                                        const res = await fetch(apiUrl('/api/skills/override'), {
                                                            method: "POST",
                                                            headers: {
                                                                "Content-Type": "application/json",
                                                                "Authorization": `Bearer ${token}`
                                                            },
                                                            body: JSON.stringify({ category: cat.id, newScore })
                                                        });
                                                        const updatedData = await res.json();
                                                        if (res.ok) setEngineData(updatedData);
                                                    } catch (err) {
                                                        console.error(err);
                                                    } finally {
                                                        setUpdateLoading(false);
                                                    }
                                                }}
                                                className={`w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer`}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Dynamic Sub-skill Breakdown */}
                                {cat.data?.numerical_breakdown && Object.keys(cat.data.numerical_breakdown).length > 0 && (
                                    <div className="space-y-3 relative z-10 mt-6 border-t border-white/5 pt-5">
                                        {Object.entries(cat.data.numerical_breakdown).slice(0, 4).map(([key, val], i) => {
                                            const score = Number(val);
                                            const pct = (score / 10) * 100;
                                            return (
                                                <div key={i} className="flex flex-col gap-1.5 group/bar">
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-white/50 capitalize font-medium group-hover/bar:text-white/80 transition-colors">{key.replace(/_/g, ' ')}</span>
                                                        <span className="text-white/80 font-bold font-mono bg-white/5 px-2 py-0.5 rounded">{score}/10</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden shadow-inner">
                                                        <div className={`h-full rounded-full bg-${cat.color}-500/80 shadow-[0_0_10px_rgba(var(--tw-color-${cat.color}-500),0.5)] transition-all duration-1000 ease-out flex items-center justify-end pr-1`} style={{ width: `${pct}%` }}>
                                                            {pct > 15 && <div className="w-1 h-1 rounded-full bg-white/50"></div>}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-4"></div>

                {/* Job Matches & Predictions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div>
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h3 className="text-xl font-display font-bold text-white tracking-wide">Career Compatibility</h3>
                                <p className="text-sm text-white/50 mt-1">Cross-referencing your profile with market required baselines.</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-black text-white glow-text leading-none">{job_eligibility_matching.job_readiness_percentage}%</div>
                                <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-1">Global Readiness</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Eligible Roles */}
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {job_eligibility_matching.eligible_roles?.map((role: any, idx: number) => (
                                <div key={`el-${idx}`} className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-2xl flex justify-between items-center gap-4 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                                    <div className="relative z-10 w-full">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-white font-bold text-lg">{role.job_title}</h4>
                                                <span className="text-[9px] font-bold uppercase tracking-widest bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.2)]">Optimized Match</span>
                                            </div>
                                            <div className="text-2xl font-black text-emerald-400">{role.eligibility_score}%</div>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <p className="text-white/60">Industry Focus: <span className="text-white/80">{role.industry || 'Tech'}</span></p>
                                            <p className="text-emerald-400/80 font-mono">{role.salary_range_lpa || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Moderate Roles */}
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {job_eligibility_matching.moderate_match_roles?.map((role: any, idx: number) => (
                                <div key={`mod-${idx}`} className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-2xl flex justify-between items-center gap-4 group hover:bg-amber-500/10 transition-colors">
                                    <div className="w-full">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-white font-bold text-lg">{role.job_title}</h4>
                                            <div className="text-xl font-bold text-amber-400">{role.eligibility_score}%</div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <p className="text-amber-300/60 text-xs">Priority Gap: <span className="text-amber-300/80">{role.gap_reason || 'Skill deficit'}</span></p>
                                            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500/70 border border-amber-500/20 px-2 py-0.5 rounded bg-amber-500/5 whitespace-nowrap">Marginal Match</span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Low Roles - Show max top 3 to avoid clutter */}
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {(job_eligibility_matching?.low_match_roles || []).slice(0, 3).map((role: any, idx: number) => (
                                <div key={`low-${idx}`} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex justify-between items-center opacity-60 hover:opacity-100 transition-opacity group hover:bg-white/10">
                                    <div className="pr-4">
                                        <h4 className="text-white/80 font-medium mb-1 group-hover:text-white transition-colors">{role.job_title}</h4>
                                        <p className="text-white/40 text-[11px] truncate max-w-[200px] sm:max-w-xs block leading-relaxed">{role.gap_reason}</p>
                                    </div>
                                    <div className="text-rose-400/80 font-bold shrink-0 text-lg group-hover:scale-110 transition-transform">{role.eligibility_score}%</div>
                                </div>
                            ))}

                            {(!job_eligibility_matching.eligible_roles?.length && !job_eligibility_matching.moderate_match_roles?.length && !job_eligibility_matching.low_match_roles?.length) && (
                                <div className="py-10 text-center border-2 border-dashed border-white/10 rounded-3xl text-white/40 text-sm flex flex-col items-center justify-center">
                                    <svg className="w-10 h-10 mb-3 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                    Complete assessments to unlock role predictions.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-indigo-900/40 to-black border border-indigo-500/20 p-6 sm:p-8 rounded-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 blur-[50px] rounded-full group-hover:bg-indigo-600/20 transition-all"></div>
                            <h4 className="text-indigo-400 font-display font-semibold mb-5 flex items-center gap-2 relative z-10 text-lg">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                Projected Career Arc
                            </h4>
                            <div className="space-y-4 relative z-10">
                                <div className="bg-white/5 rounded-2xl p-5 border border-white/5 backdrop-blur-sm">
                                    <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest block mb-1">Optimal Domain Axis</span>
                                    <span className="text-white font-medium text-lg leading-tight block">{career_direction_recommendation.best_fit_domain || 'Undetermined'}</span>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-5 border border-white/5 backdrop-blur-sm">
                                    <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest block mb-3">Growth Trajectory</span>
                                    <div className="flex flex-wrap items-center gap-2 text-sm">
                                        {career_direction_recommendation.suggested_career_path?.map((step: string, i: number, arr: string[]) => (
                                            <React.Fragment key={i}>
                                                <span className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg whitespace-nowrap font-medium text-xs shadow-inner shadow-indigo-500/10">{step}</span>
                                                {i < arr.length - 1 && <svg className="w-4 h-4 text-indigo-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>}
                                            </React.Fragment>
                                        )) || <span className="text-white/40 italic">Data insufficient</span>}
                                    </div>
                                    {career_direction_recommendation.estimated_time_to_top_role_months && (
                                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                                            <span className="text-xs text-white/50">Estimated time to peak metric:</span>
                                            <span className="text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded text-xs border border-indigo-500/20">~{career_direction_recommendation.estimated_time_to_top_role_months} months</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-cyan-900/40 to-black border border-cyan-500/20 p-6 sm:p-8 rounded-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-600/10 blur-[50px] rounded-full group-hover:bg-cyan-600/20 transition-all"></div>
                            <h4 className="text-cyan-400 font-display font-semibold mb-5 flex items-center gap-2 relative z-10 text-lg">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                Immediate Directives
                            </h4>
                            <ul className="space-y-3 relative z-10">
                                {action_plan?.immediate_steps?.map((step: string, i: number) => (
                                    <li key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all cursor-default group/item backdrop-blur-sm">
                                        <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-[0_0_10px_rgba(6,182,212,0.2)] group-hover/item:scale-110 transition-transform">
                                            <span className="text-xs font-bold">{i + 1}</span>
                                        </div>
                                        <span className="text-white/80 text-sm leading-relaxed group-hover/item:text-white transition-colors">{step}</span>
                                    </li>
                                )) || <li className="text-white/40 text-sm italic">Awaiting core data evaluation.</li>}
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
