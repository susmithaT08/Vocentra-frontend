'use client';

import { useState } from 'react';
import { generateProjectsApi } from '../api/projectApi';
import { useProjectGeneratorStore } from '../store/useProjectGeneratorStore';

export default function ProjectGeneratorForm() {
    const { setProjects, setLoading, setError, clearProjects, isLoading } = useProjectGeneratorStore();
    
    const [branch, setBranch] = useState('');
    const [level, setLevel] = useState('Beginner');
    const [domain, setDomain] = useState('');
    
    const API_LANGUAGES = ['JavaScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'Ruby', 'Swift', 'Kotlin', 'TypeScript', 'C#'];
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

    const toggleLanguage = (lang: string) => {
        setSelectedLanguages(prev => 
            prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
        );
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!branch || !domain || selectedLanguages.length === 0) {
            setError('Please fill all fields and select at least one language.');
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const projects = await generateProjectsApi({ branch, level, domain, languages: selectedLanguages });
            setProjects(projects);
        } catch (err: any) {
            if (err.isUnauthorized) {
                useProjectGeneratorStore.getState().setUnauthorized(true);
                setError(err.message);
            } else {
                setError(err.message || 'Failed to generate projects');
            }
        } finally {
            setLoading(false);
        }
    };

    if (useProjectGeneratorStore.getState().isUnauthorized) {
        return (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-8 shadow-2xl backdrop-blur-lg w-full max-w-xl mx-auto text-center animate-fade-in">
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
                        onClick={() => clearProjects()}
                        className="text-white/30 hover:text-white/60 text-xs py-2 transition-colors"
                    >
                        Clear Errors and Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-xl w-full max-w-xl mx-auto">
            <h2 className="text-2xl font-semibold text-white mb-6">Customize Your Capstone</h2>
            <form onSubmit={handleGenerate} className="space-y-6">
                
                <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Engineering Branch</label>
                    <select
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required
                    >
                        <option value="" disabled>Select your branch</option>
                        <option value="Computer Science (CSE)">Computer Science (CSE)</option>
                        <option value="Electronics (ECE)">Electronics (ECE)</option>
                        <option value="Information Technology (IT)">Information Technology (IT)</option>
                        <option value="Mechanical (ME)">Mechanical (ME)</option>
                        <option value="Electrical (EEE)">Electrical (EEE)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Target Difficulty</label>
                    <div className="flex bg-black/50 rounded-xl border border-white/10 p-1">
                        {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                            <button
                                key={lvl}
                                type="button"
                                onClick={() => setLevel(lvl)}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    level === lvl ? 'bg-violet-600 text-white shadow' : 'text-white/50 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {lvl}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Preferred Domain</label>
                    <select
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required
                    >
                        <option value="" disabled>Select project domain</option>
                        <option value="AI / Machine Learning">AI / Machine Learning</option>
                        <option value="Web Development (Full Stack)">Web Development</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                        <option value="Data Science & Analytics">Data Science</option>
                        <option value="Mobile App Development">Mobile App Development</option>
                        <option value="Cloud & DevOps">Cloud & DevOps</option>
                        <option value="Blockchain / Web3">Blockchain / Web3</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Primary Languages</label>
                    <div className="flex flex-wrap gap-2">
                        {API_LANGUAGES.map(lang => (
                            <button
                                key={lang}
                                type="button"
                                onClick={() => toggleLanguage(lang)}
                                className={`px-4 py-1.5 rounded-full border text-sm transition-all shadow-sm ${
                                    selectedLanguages.includes(lang) 
                                        ? 'bg-violet-500/20 border-violet-500 text-violet-300' 
                                        : 'bg-black/30 border-white/10 text-white/60 hover:border-white/30'
                                }`}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white py-4 rounded-xl font-medium shadow-lg shadow-violet-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Generating with AI...
                        </>
                    ) : (
                        <>✨ Generate Unique Projects</>
                    )}
                </button>
            </form>
        </div>
    );
}
