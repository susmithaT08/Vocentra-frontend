'use client';

import { useState } from 'react';
import ModuleCard from '@/components/ModuleCard';
import Link from 'next/link';
import { apiUrl } from '@/lib/api';
import ResumeForm from '@/components/ResumeForm';
import ResumePreview from '@/components/ResumePreview';
import InterviewDashboard from '@/components/interview/InterviewDashboard';
import ActiveInterview from '@/components/interview/ActiveInterview';
import FeedbackDashboard from '@/components/interview/FeedbackDashboard';
import EmployabilityDashboard from '@/components/skills/EmployabilityDashboard';

export default function CareerPage() {
    const [loginStatus, setLoginStatus] = useState<string>('');
    const [token, setToken] = useState<string>(
        typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''
    );

    // Standard API Modal State
    const [modalData, setModalData] = useState<{ title: string, data: unknown } | null>(null);

    // Resume Builder Flow States
    const [isResumeFormOpen, setIsResumeFormOpen] = useState(false);
    const [isResumePreviewOpen, setIsResumePreviewOpen] = useState(false);
    const [isGeneratingResume, setIsGeneratingResume] = useState(false);
    const [generatedResumeData, setGeneratedResumeData] = useState<{ atsScore?: number, resumeText?: string, message?: string } | null>(null);

    // Mock Interview Flow States
    const [isInterviewDashboardOpen, setIsInterviewDashboardOpen] = useState(false);
    const [activeInterviewConfig, setActiveInterviewConfig] = useState<{ mode: string, company: string } | null>(null);
    const [completedInterviewId, setCompletedInterviewId] = useState<string | null>(null);

    // Employability States
    const [isEmployabilityDashboardOpen, setIsEmployabilityDashboardOpen] = useState(false);

    // Example quick login to get JWT for the session
    const handleQuickLogin = async () => {
        try {
            setLoginStatus('Logging in...');
            const res = await fetch(apiUrl('/api/auth/login'), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: 'jane@example.com', password: 'password123' })
            });
            const data = await res.json();
            if (data.token) {
                setToken(data.token);
                localStorage.setItem('token', data.token);
                setLoginStatus('Logged in successfully!');
            } else {
                setLoginStatus('Login failed');
            }
        } catch {
            setLoginStatus('Server connection failed');
        }
    };

    const handleTestApi = async (module: string) => {
        if (!token) {
            setModalData({ title: 'Authentication Required', data: { message: "Please click 'Quick Login' first to get a token!" } });
            return;
        }

        let endpoint = "";
        let method = "GET";
        let body = null;
        let title = "";

        // Intercept resume module click
        if (module === 'resume') {
            setIsResumeFormOpen(true);
            return;
        }

        // Intercept interview module click
        if (module === 'interview') {
            setIsInterviewDashboardOpen(true);
            return;
        }

        // Intercept employability module click
        if (module === 'skills') {
            setIsEmployabilityDashboardOpen(true);
            return;
        }

        switch (module) {
            case 'resume':
                // Keeping this for fallback, but it shouldn't be reached
                title = "Resume Builder API Response";
                endpoint = "/api/resume/create";
                method = "POST";
                body = JSON.stringify({ title: "Test Resume", skills: ["React", "Express"] });
                break;
            case 'interview':
                title = "Interview Questions API Response";
                endpoint = "/api/interview/questions";
                break;
            case 'skills':
                title = "Employability Intelligence API Response";
                endpoint = "/api/skills/analyze";
                break;
            case 'linkedin':
                title = "LinkedIn Optimizer API Response";
                endpoint = "/api/linkedin/analyze";
                method = "POST";
                body = JSON.stringify({ profileUrl: "https://linkedin.com/in/test" });
                break;
        }

        try {
            const res = await fetch(apiUrl(endpoint), {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body
            });
            const data = await res.json();
            setModalData({ title, data });
        } catch (err) {
            setModalData({ title: 'Error', data: { message: `Failed calling API: ${(err as Error).message}` } });
        }
    };

    // Handle actual resume generation submission
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleGenerateResume = async (formData: any) => {
        setIsGeneratingResume(true);
        try {
            const res = await fetch(apiUrl('/api/resume/create'), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            console.log("Resume API Response:", data);

            if (res.ok) {
                setGeneratedResumeData(data);
                setIsResumeFormOpen(false);
                setIsResumePreviewOpen(true);

                // Sync progress
                import('@/store/useProgressStore').then(module => {
                    module.useProgressStore.getState().incrementMetric('career', 5, { action: 'resume_generated' });
                });
            } else {
                alert(`Error: ${data.message || 'Failed to generate resume'}`);
            }
        } catch {
            alert('Failed to connect to the server.');
        } finally {
            setIsGeneratingResume(false);
        }
    };

    return (
        <div className="animate-slide-up relative">
            {/* Modal Overlay */}
            {modalData && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-2xl shadow-2xl animate-fade-in relative max-h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-white">{modalData.title}</h3>
                            <button
                                onClick={() => setModalData(null)}
                                className="text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full p-1"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="bg-black/50 p-4 rounded-xl overflow-y-auto border border-white/5 flex-grow text-white/90">
                            {/* Format the data object beautifully instead of showing raw code */}
                            {(() => {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const renderData = (data: any, indent = 0) => {
                                    if (typeof data === 'string') return <span className="text-emerald-300">{data}</span>;
                                    if (typeof data === 'number') return <span className="text-sky-300">{data}</span>;
                                    if (typeof data === 'boolean') return <span className="text-rose-300">{data ? 'true' : 'false'}</span>;
                                    if (Array.isArray(data)) {
                                        return (
                                            <ul className={`list-disc list-inside mt-1 ml-${indent > 0 ? 4 : 0} space-y-1`}>
                                                {data.map((item, idx) => (
                                                    <li key={idx}>{renderData(item, indent + 1)}</li>
                                                ))}
                                            </ul>
                                        );
                                    }
                                    if (typeof data === 'object' && data !== null) {
                                        // Ignore MongoDB IDs and technical fields for a cleaner UI
                                        const cleanKeys = Object.keys(data).filter(k => k !== '_id' && k !== '__v' && k !== 'userId' && k !== 'createdAt' && k !== 'updatedAt');
                                        return (
                                            <div className={`mt-2 ml-${indent > 0 ? 4 : 0} space-y-3`}>
                                                {cleanKeys.map(key => (
                                                    <div key={key} className="bg-white/5 p-3 rounded-lg border border-white/5">
                                                        <span className="font-semibold text-violet-300 capitalize block mb-1">
                                                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                                                        </span>
                                                        <div className="text-sm">
                                                            {renderData(data[key], indent + 1)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    }
                                    return <span>{String(data)}</span>;
                                };
                                return renderData(modalData.data);
                            })()}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setModalData(null)}
                                className="px-6 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-medium transition-colors text-white shadow-lg shadow-violet-500/20"
                            >
                                Awesome!
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Resume Builder Flow */}
            {isResumeFormOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4 md:p-8">
                    <div className="w-full max-w-3xl">
                        <ResumeForm
                            onSubmit={handleGenerateResume}
                            onCancel={() => setIsResumeFormOpen(false)}
                            isLoading={isGeneratingResume}
                        />
                    </div>
                </div>
            )}

            {isResumePreviewOpen && generatedResumeData && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4 md:p-8">
                    <ResumePreview
                        resumeData={generatedResumeData}
                        onEdit={() => {
                            setIsResumePreviewOpen(false);
                            setIsResumeFormOpen(true);
                        }}
                        onClose={() => setIsResumePreviewOpen(false)}
                    />
                </div>
            )}

            {/* AI Mock Interview Flow */}
            {isInterviewDashboardOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4 md:p-8">
                    <div className="w-full max-w-4xl max-h-screen">
                        <InterviewDashboard
                            token={token}
                            onStartNew={(mode, company) => {
                                setIsInterviewDashboardOpen(false);
                                setActiveInterviewConfig({ mode, company });
                            }}
                            onClose={() => setIsInterviewDashboardOpen(false)}
                        />
                    </div>
                </div>
            )}

            {activeInterviewConfig && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[70] flex items-center justify-center p-4 md:p-8 shadow-2xl">
                    <div className="w-full max-w-5xl h-full max-h-[90vh]">
                        <ActiveInterview
                            token={token}
                            mode={activeInterviewConfig.mode}
                            company={activeInterviewConfig.company}
                            onComplete={(id) => {
                                setActiveInterviewConfig(null);
                                setCompletedInterviewId(id);
                            }}
                            onCancel={() => setActiveInterviewConfig(null)}
                        />
                    </div>
                </div>
            )}

            {completedInterviewId && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4 md:p-8">
                    <div className="w-full max-w-5xl h-[90vh]">
                        <FeedbackDashboard
                            token={token}
                            interviewId={completedInterviewId}
                            onClose={() => setCompletedInterviewId(null)}
                        />
                    </div>
                </div>
            )}

            {/* AI Employability Engine Flow */}
            {isEmployabilityDashboardOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4 md:p-8">
                    <div className="w-full max-w-5xl h-full max-h-[90vh]">
                        <EmployabilityDashboard
                            token={token}
                            onClose={() => setIsEmployabilityDashboardOpen(false)}
                        />
                    </div>
                </div>
            )}

            <div className="mb-8 flex justify-between items-start">
                <div>
                    <Link href="/dashboard" className="flex items-center gap-2 text-white/50 hover:text-white mb-4 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        <span className="text-sm">Back to Dashboard</span>
                    </Link>
                    <h2 className="font-display text-3xl font-semibold text-white mb-2">Career Preparation</h2>
                    <p className="text-white/50">Build your professional presence and land your dream role</p>
                </div>

                {/* Debug / Test Controls */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-right">
                    <p className="text-sm text-white/60 mb-2">Backend Connection Status:</p>
                    <button
                        onClick={handleQuickLogin}
                        className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-medium transition-colors"
                    >
                        {token ? "Token Active" : "Quick Login (Test)"}
                    </button>
                    {loginStatus && <p className="text-xs text-emerald-400 mt-2">{loginStatus}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div onClick={() => handleTestApi('resume')} className="cursor-pointer hover:scale-[1.02] transition-transform">
                    <ModuleCard
                        title="Resume Builder"
                        description="Generate an ATS-optimized, professional resume instantly using AI."
                        icon={<span className="text-2xl">📄✨</span>}
                        color="rose"
                        metadata="AI Powered"
                    />
                </div>
                <div onClick={() => handleTestApi('interview')} className="cursor-pointer hover:scale-[1.02] transition-transform">
                    <ModuleCard
                        title="Mock Interviews"
                        description="4-Round Deep AI Simulation (HR, Tech, Managerial, Stress)"
                        icon={<span className="text-2xl">👔✨</span>}
                        color="orange"
                        metadata="Live AI Mode"
                    />
                </div>
                <div onClick={() => handleTestApi('skills')} className="cursor-pointer hover:scale-[1.02] transition-transform">
                    <ModuleCard
                        title="Employability Intelligence"
                        description="AI Mapping: Match your simulated scores to real Corporate Job requirements."
                        icon={<span className="text-2xl">🧠</span>}
                        color="indigo"
                        metadata="AI Engine"
                    />
                </div>
                <Link href="/dashboard/career/linkedin-optimizer" className="cursor-pointer hover:scale-[1.02] transition-transform block">
                    <ModuleCard
                        title="LinkedIn Optimizer"
                        description="Strategic profile analysis and keyword optimization for recruiter visibility."
                        icon={<span className="text-2xl">🔗</span>}
                        color="sky"
                        metadata="Professional AI"
                    />
                </Link>
                <Link href="/dashboard/career/project-generator" className="cursor-pointer hover:scale-[1.02] transition-transform block">
                    <ModuleCard
                        title="AI Project Generator"
                        description="Unique, non-repetitive capstone projects tailored to your degree and tech stack."
                        icon={<span className="text-2xl">⚡</span>}
                        color="teal"
                        metadata="Live AI Mode"
                    />
                </Link>
            </div>
        </div>
    );
}
