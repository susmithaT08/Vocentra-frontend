'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/lib/api';

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        role: '',
        education: '',
        targetDomain: '',
        experienceLevel: '',
        preferredInterviewRole: '',
        skills: [] as string[],
        learningGoals: [] as string[]
    });

    const handleNext = () => setStep(s => s + 1);
    const handlePrev = () => setStep(s => s - 1);

    const handleSelectOption = (field: keyof typeof formData, value: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleToggleMulti = (field: 'skills' | 'learningGoals', value: string) => {
        setFormData((prev: any) => {
            const current = prev[field];
            const updated = current.includes(value)
                ? current.filter((item: any) => item !== value)
                : [...current, value];
            return { ...prev, [field]: updated };
        });
    };

    const handleFinish = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('vocentra_token');
            const res = await fetch(apiUrl('/api/users/profile'), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...formData, isOnboardingComplete: true }),
            });

            if (res.status === 401) {
                localStorage.removeItem('vocentra_token');
                document.cookie = 'vocentra_token=; path=/; max-age=0';
                alert('Your session has expired. Please log in again.');
                router.push('/login');
                return;
            }
            if (!res.ok) throw new Error('Failed to save profile');
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
            alert('Something went wrong saving your profile.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none animate-float"></div>
            <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-violet-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" style={{ animation: 'float 5s ease-in-out infinite reverse' }}></div>

            <div className="w-full max-w-2xl relative z-10 animate-slide-up">

                {/* Header Area */}
                <div className="mb-8 text-center space-y-3">
                    <div className="inline-flex items-center justify-center p-3 mb-2 rounded-2xl bg-white/5 border border-white/10 shadow-xl backdrop-blur-md">
                        <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white tracking-tight">Vocentra Setup</h1>
                    <p className="text-white/50 text-sm">Personalize your AI Career Intelligence profile</p>
                </div>

                <div className="relative glass-card rounded-3xl shadow-2xl overflow-hidden border border-white/10 bg-black/40">
                    {/* Glowing Progress Bar */}
                    <div className="h-1.5 w-full bg-white/5 relative">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(167,139,250,0.6)]"
                            style={{ width: `${(step / 4) * 100}%` }}
                        />
                    </div>

                    <div className="p-8 sm:p-10 min-h-[450px] flex flex-col justify-between">

                        {/* Step 1: Role */}
                        {step === 1 && (
                            <div className="animate-fade-in space-y-6">
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-semibold text-white">Who are you?</h2>
                                    <p className="text-white/50 text-sm">Select your current status to tailor your experience.</p>
                                </div>
                                <div className="grid gap-4">
                                    {[
                                        { id: 'student', label: 'Student', desc: 'Looking for early career guidance' },
                                        { id: 'job seeker', label: 'Job Seeker', desc: 'Actively applying to roles' },
                                        { id: 'professional', label: 'Professional', desc: 'Advancing an existing career' }
                                    ].map(role => (
                                        <button
                                            key={role.id}
                                            onClick={() => handleSelectOption('role', role.id)}
                                            className={`w-full p-5 text-left rounded-2xl transition-all duration-300 group relative overflow-hidden ${formData.role === role.id
                                                ? 'bg-violet-600/20 border-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.15)] ring-1 ring-violet-500/50'
                                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                                } border`}
                                        >
                                            <div className="relative z-10 flex items-center justify-between">
                                                <div>
                                                    <div className={`font-semibold text-lg mb-1 transition-colors ${formData.role === role.id ? 'text-violet-300' : 'text-white/90 group-hover:text-white'}`}>
                                                        {role.label}
                                                    </div>
                                                    <div className="text-sm text-white/50">{role.desc}</div>
                                                </div>
                                                {formData.role === role.id && (
                                                    <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center animate-fade-in">
                                                        <svg className="w-4 h-4 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Experience & Domain */}
                        {step === 2 && (
                            <div className="animate-fade-in space-y-6">
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-semibold text-white">Tell us about your background</h2>
                                    <p className="text-white/50 text-sm">This helps calibrate mock interviews.</p>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <label className="block text-sm font-medium text-white/80 ml-1">Experience Level</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {['Entry Level', 'Mid Level', 'Senior'].map(lvl => (
                                            <button
                                                key={lvl}
                                                onClick={() => handleSelectOption('experienceLevel', lvl)}
                                                className={`p-4 text-sm font-medium text-center rounded-xl transition-all duration-300 border ${formData.experienceLevel === lvl
                                                    ? 'bg-violet-600/20 border-violet-500/50 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                                                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                                                    }`}
                                            >
                                                {lvl}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4">
                                    <label className="block text-sm font-medium text-white/80 ml-1">Target Career Domain</label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-white/40 group-focus-within/input:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.targetDomain}
                                            onChange={(e) => handleSelectOption('targetDomain', e.target.value)}
                                            placeholder="e.g. Software Engineering, Marketing"
                                            className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all text-white placeholder-white/30 hover:bg-white/10"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Skills */}
                        {step === 3 && (
                            <div className="animate-fade-in space-y-6">
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-semibold text-white">What are your top skills?</h2>
                                    <p className="text-white/50 text-sm">Select up to 5 that apply best to you.</p>
                                </div>
                                <div className="flex flex-wrap gap-2.5 pt-4">
                                    {['JavaScript', 'Python', 'React', 'Node.js', 'UI/UX Design', 'Project Management', 'Data Analysis', 'AWS', 'Public Speaking', 'Sales', 'Marketing', 'SQL'].map(skill => {
                                        const isSelected = formData.skills.includes(skill);
                                        return (
                                            <button
                                                key={skill}
                                                onClick={() => handleToggleMulti('skills', skill)}
                                                className={`px-4 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 ${isSelected
                                                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 border-transparent text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] transform scale-[1.02]'
                                                    : 'bg-white/5 border-white/10 hover:border-white/20 text-white/70 hover:text-white hover:bg-white/10'
                                                    }`}
                                            >
                                                {skill}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Step 4: Goals */}
                        {step === 4 && (
                            <div className="animate-fade-in space-y-6">
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-semibold text-white">What do you want to achieve?</h2>
                                    <p className="text-white/50 text-sm">Select your primary goals to customize the dashboard.</p>
                                </div>
                                <div className="grid gap-3 pt-2">
                                    {[
                                        'Build a standout resume',
                                        'Practice mock interviews',
                                        'Improve English communication/speaking',
                                        'Optimize my LinkedIn profile'
                                    ].map(goal => {
                                        const isSelected = formData.learningGoals.includes(goal);
                                        return (
                                            <button
                                                key={goal}
                                                onClick={() => handleToggleMulti('learningGoals', goal)}
                                                className={`w-full p-4 text-left border rounded-xl transition-all duration-300 flex items-center group ${isSelected
                                                    ? 'bg-violet-600/20 border-violet-500/50 text-white shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                                                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 text-white/80 hover:text-white'
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 rounded-md border mr-4 flex flex-shrink-0 items-center justify-center transition-all duration-300 ${isSelected
                                                    ? 'bg-violet-500 border-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]'
                                                    : 'border-white/30 group-hover:border-white/50'
                                                    }`}>
                                                    {isSelected && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                </div>
                                                <span className="font-medium text-sm">{goal}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-6">
                            {step > 1 ? (
                                <button
                                    onClick={handlePrev}
                                    className="px-6 py-2.5 rounded-xl text-white/70 font-medium hover:bg-white/10 hover:text-white transition-all text-sm"
                                >
                                    Back
                                </button>
                            ) : <div />}

                            {step < 4 ? (
                                <button
                                    onClick={handleNext}
                                    disabled={step === 1 && !formData.role}
                                    className={`px-8 py-2.5 rounded-xl font-medium transition-all text-sm flex items-center gap-2 ${(step === 1 && !formData.role)
                                        ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
                                        : 'bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                                        }`}
                                >
                                    Continue <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </button>
                            ) : (
                                <button
                                    onClick={handleFinish}
                                    disabled={loading || formData.learningGoals.length === 0}
                                    className={`px-8 py-2.5 rounded-xl font-medium transition-all text-sm flex items-center gap-2 relative overflow-hidden group ${(formData.learningGoals.length === 0)
                                        ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
                                        : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transform hover:-translate-y-0.5 active:translate-y-0'
                                        }`}
                                >
                                    <span className={`flex items-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                                        Complete Profile <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    </span>
                                    {loading && (
                                        <span className="absolute inset-0 flex items-center justify-center">
                                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </span>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
