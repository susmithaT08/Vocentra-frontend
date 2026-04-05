'use client';

import { useState } from 'react';
import { analyzeProfileApi } from '../api/linkedinApi';
import { useLinkedinStore } from '../store/useLinkedinStore';

export default function LinkedinOptimizerForm() {
    const { setAnalysis, setLoading, setError, setManualInputNeeded, isLoading, needsManualInput, reset } = useLinkedinStore();
    
    // Step 1: URL input
    const [url, setUrl] = useState('');
    
    // Step 2: Manual fallback inputs
    const [headline, setHeadline] = useState('');
    const [about, setAbout] = useState('');
    const [experience, setExperience] = useState('');
    const [skills, setSkills] = useState('');

    const validateLinkedInUrl = (input: string) => {
        const regex = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|pub)\/[\w-]+\/?$/;
        return regex.test(input);
    };

    const handleUrlSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const cleanUrl = url.trim();
        if (!validateLinkedInUrl(cleanUrl)) {
            setError('Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username)');
            return;
        }

        setLoading(true);
        try {
            const { analysisResult } = await analyzeProfileApi({ profileUrl: cleanUrl });
            setAnalysis(analysisResult);
        } catch (err: any) {
            if (err.requiresManualInput) {
                setManualInputNeeded(true);
                setError(err.message);
            } else if (err.isUnauthorized) {
                useLinkedinStore.getState().setUnauthorized(true);
                setError(err.message);
            } else {
                setError(err.message || 'Analysis failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!headline || !about || !experience || !skills) {
            setError('Please fill in all manual fields for a complete analysis.');
            return;
        }

        setLoading(true);
        try {
            const { analysisResult } = await analyzeProfileApi({ 
                profileUrl: url,
                manualData: { headline, about, experience, skills } 
            });
            setAnalysis(analysisResult);
        } catch (err: any) {
            if (err.isUnauthorized) {
                useLinkedinStore.getState().setUnauthorized(true);
                setError(err.message);
            } else {
                setError(err.message || 'Analysis failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (useLinkedinStore.getState().isUnauthorized) {
        return (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-lg w-full max-w-xl mx-auto text-center animate-fade-in">
                <div className="w-16 h-16 bg-rose-500/20 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">🔐</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Session Expired</h2>
                <p className="text-white/50 text-sm mb-8">Your authentication token is invalid or has expired due to a server security refresh. Please return to the dashboard to reconnect.</p>
                <div className="flex flex-col gap-3">
                    <a 
                        href="/dashboard/career"
                        className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-white/90 transition-all flex justify-center items-center gap-2"
                    >
                        Return to Career Dashboard
                    </a>
                    <button 
                        onClick={reset}
                        className="text-white/30 hover:text-white/60 text-xs py-2 transition-colors"
                    >
                        Clear Errors and Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (needsManualInput) {
        return (
            <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-md animate-slide-up">
                <div className="flex items-start gap-4 mb-6 bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
                    <div className="text-2xl text-amber-400">⚠️</div>
                    <div>
                        <h4 className="font-semibold text-amber-200">Scraper Restricted</h4>
                        <p className="text-xs text-amber-200/70 leading-relaxed">
                            LinkedIn's security prevents us from reading your profile directly. Please paste your details below so we can run the AI optimization cycle.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleManualSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Headline</label>
                        <input 
                            value={headline}
                            onChange={(e) => setHeadline(e.target.value)}
                            placeholder="e.g., Software Engineer | React | Node.js"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500/50 outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">About / Summary</label>
                        <textarea 
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            rows={3}
                            placeholder="Paste your 'About' section here..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500/50 outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Experience Highlights</label>
                        <textarea 
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            rows={3}
                            placeholder="Paste your key job bullet points here..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500/50 outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Key Skills</label>
                        <input 
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            placeholder="e.g., Python, Docker, AWS, Management"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500/50 outline-none transition-colors"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button 
                            type="button" 
                            onClick={reset}
                            className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="flex-[2] py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                        >
                            {isLoading ? 'Optimizing Profile...' : 'Run Analysis (Manual)'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-lg w-full max-w-xl mx-auto">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-sky-500/20 border border-sky-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-sky-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">LinkedIn Strategy Engine</h2>
                <p className="text-white/50 text-sm">Paste your profile link to detect hidden gaps and skyrocket visibility.</p>
            </div>

            <form onSubmit={handleUrlSubmit} className="space-y-6">
                <div className="relative group">
                    <input 
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://linkedin.com/in/your-username"
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:outline-none focus:border-sky-500/50 transition-all pr-24"
                    />
                    <div className="absolute inset-y-0 right-2 flex items-center">
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-sky-500/25 disabled:opacity-50"
                        >
                            {isLoading ? 'Detecting...' : 'Review'}
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-white/30 px-2 justify-center italic">
                    <div className="flex-1 border-t border-white/5"></div>
                    <span>Pro Tip: Ensure your profile is public</span>
                    <div className="flex-1 border-t border-white/5"></div>
                </div>
            </form>
        </div>
    );
}
