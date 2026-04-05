'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/lib/api';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        targetDomain: '',
        experienceLevel: '',
        skills: [] as string[]
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('vocentra_token');
            if (!token) {
                router.push('/login');
                return;
            }
            const res = await fetch(apiUrl('/api/users/profile'), {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
                setFormData({
                    name: data.name || '',
                    role: data.role || '',
                    targetDomain: data.targetDomain || '',
                    experienceLevel: data.experienceLevel || '',
                    skills: data.skills || []
                });
            } else {
                router.push('/login');
            }
        } catch (error) {
            console.error('Failed to fetch profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('vocentra_token');
            const res = await fetch(apiUrl('/api/users/profile'), {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                const updatedUser = await res.json();
                setUser(updatedUser);
                setEditMode(false);
            }
        } catch (error) {
            console.error('Failed to update profile', error);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
    }

    if (!user) return null;

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative min-h-screen">
            {/* Background Glows */}
            <div className="absolute top-20 left-10 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 relative z-10 gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
                        <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Command Center
                    </h1>
                    <p className="text-white/50 text-sm mt-1 ml-11">Manage your identity and career assets</p>
                </div>
                <button
                    onClick={() => editMode ? handleSave() : setEditMode(true)}
                    className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:-translate-y-0.5 ${editMode
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                        }`}
                >
                    {editMode ? (
                        <>Save Changes <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg></>
                    ) : (
                        <>Edit Profile <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                {/* Left Column: Identity Card */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="glass-card rounded-3xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl relative group">
                        {/* Interactive Banner */}
                        <div className="h-32 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-800 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>

                        <div className="px-6 pb-6 relative flex flex-col items-center">
                            {/* Avatar */}
                            <div className="relative -mt-16 mb-4 group/avatar">
                                <div className="w-32 h-32 rounded-full border-4 border-[#0B0F19] bg-gray-800 overflow-hidden flex items-center justify-center text-4xl text-gray-500 font-bold shadow-[0_0_30px_rgba(139,92,246,0.3)] relative z-10">
                                    {user.profilePhoto ? (
                                        <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white/50">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                {editMode && (
                                    <button className="absolute bottom-2 right-2 bg-violet-600 hover:bg-violet-500 text-white p-2.5 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all z-20 hover:scale-110">
                                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </button>
                                )}
                            </div>

                            <div className="text-center w-full">
                                {editMode ? (
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full text-center text-xl font-bold bg-white/5 border border-white/20 rounded-lg px-3 py-1.5 text-white focus:ring-2 focus:ring-violet-500 outline-none mb-2"
                                        placeholder="Your Name"
                                    />
                                ) : (
                                    <h2 className="text-2xl font-bold text-white mb-1 group-hover:text-violet-300 transition-colors">{user.name}</h2>
                                )}

                                <div className="flex items-center justify-center gap-2 text-sm text-white/50 mb-6 w-full truncate">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    <span className="truncate">{user.email}</span>
                                </div>

                                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6"></div>

                                <div className="space-y-4 text-left w-full">
                                    <div>
                                        <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-1.5 block">Account Status</label>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                            Verified
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-1.5 block">Current Role</label>
                                        {editMode ? (
                                            <div className="relative">
                                                <select
                                                    value={formData.role}
                                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                                    className="w-full appearance-none bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-violet-500 outline-none"
                                                >
                                                    <option value="student" className="bg-gray-900 text-white">Student</option>
                                                    <option value="job seeker" className="bg-gray-900 text-white">Job Seeker</option>
                                                    <option value="professional" className="bg-gray-900 text-white">Professional</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-white/50">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-white/90 capitalize text-sm font-medium">{user.role || 'Not specified'}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Details & Assets */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Career Details Panel */}
                    <div className="glass-card rounded-3xl border border-white/10 bg-black/40 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 blur-[100px] rounded-full pointer-events-none"></div>

                        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            Career Trajectory
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
                            <div>
                                <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Target Domain</label>
                                {editMode ? (
                                    <input
                                        type="text"
                                        value={formData.targetDomain}
                                        onChange={e => setFormData({ ...formData, targetDomain: e.target.value })}
                                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all focus:bg-white/10 placeholder-white/20"
                                        placeholder="e.g. Software Engineering"
                                    />
                                ) : (
                                    <div className="text-white/90 font-medium bg-white/5 border border-white/5 rounded-xl px-4 py-3 min-h-[46px] flex items-center">
                                        {user.targetDomain || <span className="text-white/30 italic font-normal">Not specified</span>}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Experience Level</label>
                                {editMode ? (
                                    <div className="relative">
                                        <select
                                            value={formData.experienceLevel}
                                            onChange={e => setFormData({ ...formData, experienceLevel: e.target.value })}
                                            className="w-full appearance-none bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all focus:bg-white/10"
                                        >
                                            <option value="" className="bg-gray-900 text-white">Select level</option>
                                            <option value="Entry Level" className="bg-gray-900 text-white">Entry Level</option>
                                            <option value="Mid Level" className="bg-gray-900 text-white">Mid Level</option>
                                            <option value="Senior" className="bg-gray-900 text-white">Senior</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-white/50">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-white/90 font-medium bg-white/5 border border-white/5 rounded-xl px-4 py-3 min-h-[46px] flex items-center">
                                        {user.experienceLevel || <span className="text-white/30 italic font-normal">Not specified</span>}
                                    </div>
                                )}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Core Skills</label>
                                {editMode ? (
                                    <div>
                                        <input
                                            type="text"
                                            value={formData.skills.join(', ')}
                                            onChange={e => setFormData({ ...formData, skills: e.target.value.split(',').map(s => s.trim()) })}
                                            placeholder="React, Python, Project Management (comma separated)"
                                            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all focus:bg-white/10 placeholder-white/20"
                                        />
                                        <p className="text-xs text-white/30 mt-2 ml-1">Separate skills with commas to create tags.</p>
                                    </div>
                                ) : (
                                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 min-h-[64px] flex flex-wrap gap-2 items-center">
                                        {user.skills?.length > 0 ? (
                                            user.skills.map((skill: string, i: number) => (
                                                <span key={i} className="px-3.5 py-1.5 bg-violet-500/20 border border-violet-500/30 text-violet-300 rounded-lg text-xs font-medium shadow-[0_0_10px_rgba(139,92,246,0.1)]">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-sm text-white/30 italic">No skills added yet</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Digital Assets / Resume Manager Layout */}
                    <div className="glass-card rounded-3xl border border-white/10 bg-black/40 shadow-2xl p-6 sm:p-8 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2 relative z-10">
                            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Digital Assets
                        </h3>

                        <div className="border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 hover:border-blue-500/50 rounded-2xl p-8 sm:p-10 text-center transition-all duration-300 relative z-10 group/dropzone cursor-pointer">
                            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4 group-hover/dropzone:scale-110 group-hover/dropzone:bg-blue-500/20 transition-all duration-300">
                                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-medium text-white mb-2">Upload Resume PDF</h4>
                            <p className="text-sm text-white/50 mb-6 max-w-sm mx-auto">Drag and drop your resume file here to enable AI-powered analysis and optimizations.</p>
                            <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 text-white text-sm font-medium rounded-xl transition-all shadow-lg min-w-[140px]">
                                Browse Files
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
