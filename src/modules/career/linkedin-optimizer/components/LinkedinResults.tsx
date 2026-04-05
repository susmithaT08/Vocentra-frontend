'use client';

import { useLinkedinStore } from '../store/useLinkedinStore';
import { useProgressStore } from '@/store/useProgressStore';

export default function LinkedinResults() {
    const { analysisResult, reset } = useLinkedinStore();

    if (!analysisResult) return null;

    const { 
        overallScore = 0, 
        scoreBreakdown = {}, 
        feedback = { strengths: [], gaps: [] }, 
        sectionSuggestions = {}, 
        keywordOptimization = [], 
        visibilityTips = [], 
        sampleSnippets = [] 
    } = analysisResult;

    const handleCompete = () => {
        // Sync read-only progress to Dashboard
        useProgressStore.getState().incrementMetric('career', 10, { action: 'linkedin_optimized' });
        alert("Awesome! Your Career progress has been updated. Go implement these changes on LinkedIn!");
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in pb-32">
            <div className="flex justify-between items-center bg-slate-900/60 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                            <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-sky-500" strokeDasharray={2 * Math.PI * 44} strokeDashoffset={2 * Math.PI * 44 * (1 - overallScore / 100)} strokeLinecap="round" />
                        </svg>
                        <span className="absolute text-2xl font-bold text-white">{overallScore}</span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-1">Profile Optimization Score</h3>
                        <p className="text-white/50 text-sm">Your professional presence is {overallScore < 70 ? 'below industry standard' : 'strong but has growth room'}.</p>
                    </div>
                </div>
                <button 
                    onClick={reset}
                    className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all"
                >
                    Start New Review
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Feedback Section */}
                    <div className="bg-slate-900/60 p-8 rounded-3xl border border-white/10 backdrop-blur-md">
                        <h4 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 bg-sky-500/20 rounded-lg flex items-center justify-center text-sky-400">📊</span>
                            Strategic Analysis
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Key Strengths</h5>
                                <ul className="space-y-3">
                                    {feedback?.strengths?.map((s: string, i: number) => (
                                        <li key={i} className="flex gap-3 text-sm text-white/80">
                                            <span className="text-emerald-500">✓</span> {s}
                                        </li>
                                    )) || <li className="text-white/30 text-xs italic">No strengths identified yet.</li>}
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <h5 className="text-xs font-bold text-rose-400 uppercase tracking-widest">Growth Gaps</h5>
                                <ul className="space-y-3">
                                    {feedback?.gaps?.map((g: string, i: number) => (
                                        <li key={i} className="flex gap-3 text-sm text-white/80">
                                            <span className="text-rose-500">!</span> {g}
                                        </li>
                                    )) || <li className="text-white/30 text-xs italic">No specific gaps found.</li>}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Section Rewrites */}
                    <div className="bg-slate-900/60 p-8 rounded-3xl border border-white/10 backdrop-blur-md overflow-hidden">
                        <h4 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 bg-violet-500/20 rounded-lg flex items-center justify-center text-violet-400">📝</span>
                            Before & After Snippets
                        </h4>
                        <div className="space-y-6">
                            {(sampleSnippets || []).map((snp: any, i: number) => (
                                <div key={i} className="group">
                                    <div className="text-xs font-bold text-white/30 uppercase mb-3 flex items-center gap-2">
                                        {snp.section} REWRITE
                                        <div className="flex-1 border-t border-white/5"></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-black/30 p-4 rounded-xl border border-white/5 relative">
                                            <span className="absolute top-0 right-3 text-[10px] text-white/20 font-bold -translate-y-1/2 bg-slate-900 px-2">CURRENT</span>
                                            <p className="text-xs text-white/40 italic line-through">{snp.before}</p>
                                        </div>
                                        <div className="bg-sky-500/5 p-4 rounded-xl border border-sky-500/20 relative">
                                            <span className="absolute top-0 right-3 text-[10px] text-sky-400 font-bold -translate-y-1/2 bg-slate-900 px-2 uppercase tracking-widest italic">OPTIMIZED</span>
                                            <p className="text-xs text-sky-100 leading-relaxed font-medium">{snp.after}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Score Breakdown */}
                    <div className="bg-slate-900/60 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
                        <h4 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-6 px-1">Score Breakdown</h4>
                        <div className="space-y-5">
                            {Object.entries(scoreBreakdown || {}).map(([key, val]: any) => (
                                <div key={key}>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="capitalize text-white/70">{key}</span>
                                        <span className="text-white font-bold">{val}%</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-sky-500 to-indigo-500" style={{ width: `${val}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SEO Keywords */}
                    <div className="bg-slate-900/60 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
                        <h4 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4 px-1">SEO Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                            {(keywordOptimization || []).map((kw: string, i: number) => (
                                <span key={i} className="text-[10px] font-bold px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/60 hover:text-sky-400 hover:border-sky-500/30 transition-all cursor-default">
                                    {kw}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Visibility Tips */}
                    <div className="bg-sky-600 p-6 rounded-3xl shadow-xl shadow-sky-900/20">
                        <h4 className="text-sm font-bold text-white/80 uppercase tracking-widest mb-4">Recruiter visibility</h4>
                        <ul className="space-y-4">
                            {(visibilityTips || []).map((tip: string, i: number) => (
                                <li key={i} className="flex gap-3 text-sm text-white font-medium leading-relaxed">
                                    <div className="w-5 h-5 bg-white/20 rounded-full flex-shrink-0 flex items-center justify-center text-[10px]">✨</div>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center pt-8">
                <div className="mb-6 flex flex-col items-center text-center">
                    <h4 className="text-xl font-bold text-white mb-2 italic">Ready to level up?</h4>
                    <p className="text-sm text-white/40">Apply these changes to your LinkedIn profile and watch the connection requests roll in.</p>
                </div>
                <button 
                    onClick={handleCompete}
                    className="group relative px-12 py-4 bg-white text-black font-bold rounded-2xl transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-white/10 active:scale-95"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        Mark as Optimized (+10 XP)
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </span>
                 </button>
            </div>
        </div>
    );
}
