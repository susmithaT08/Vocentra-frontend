'use client';

import Link from 'next/link';
import LinkedinOptimizerForm from '@/modules/career/linkedin-optimizer/components/LinkedinOptimizerForm';
import LinkedinResults from '@/modules/career/linkedin-optimizer/components/LinkedinResults';
import { useLinkedinStore } from '@/modules/career/linkedin-optimizer/store/useLinkedinStore';

export default function LinkedinOptimizerPage() {
    const { analysisResult, error } = useLinkedinStore();

    return (
        <div className="min-h-screen bg-[#050B18] text-white/90 p-4 md:p-8 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-12">
                    <Link href="/dashboard/career" className="flex items-center gap-2 text-white/40 hover:text-white mb-6 transition-colors group w-fit">
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        <span className="text-sm font-medium">Back to Career Dashboard</span>
                    </Link>
                    
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/40">
                            LinkedIn Profile <br />
                            <span className="text-sky-400">Strategy Engine</span>
                        </h1>
                        <p className="text-lg text-white/50 leading-relaxed italic">
                            High-impact profile optimization powered by Executive Coaching AI. Outrank the competition and grab the attention of Top-Tier recruiters.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm flex items-center gap-3 animate-shake">
                         <span className="text-lg">🛑</span> {error}
                    </div>
                )}

                <div className="flex flex-col gap-12 items-center w-full">
                    {/* If no analysis, show form. If analysis exists, show results */}
                    {!analysisResult ? (
                        <div className="w-full animate-fade-in py-12">
                            <LinkedinOptimizerForm />
                        </div>
                    ) : (
                        <div className="w-full">
                            <LinkedinResults />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
