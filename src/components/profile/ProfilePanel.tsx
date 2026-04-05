'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ProfilePanel() {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        role: 'Job Seeker',
        education: 'B.S. Computer Science',
        targetDomain: 'Frontend Development',
        skills: 'React, TypeScript, Next.js',
        experienceLevel: 'Mid Level',
        preferredInterviewRole: 'Frontend Engineer',
        learningGoals: 'Master React Server Components'
    });

    const [completionPercentage] = useState(85); // Mock metric

    const handleSave = () => {
        setIsEditing(false);
        // Dispatch save to backend...
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-6 text-white space-y-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Left Column: Avatar & Quick Stats */}
                <div className="md:w-1/3 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden text-center shadow-xl"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[50px] rounded-full"></div>

                        <div className="relative inline-block w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-purple-500 to-indigo-500 mb-4 mx-auto group cursor-pointer">
                            <div className="w-full h-full rounded-full bg-[#1a1025] flex items-center justify-center overflow-hidden">
                                <span className="text-4xl font-display font-bold text-gray-400">JD</span>
                            </div>
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-sm font-medium">Change Photo</span>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold font-display">{profileData.name}</h2>
                        <p className="text-purple-400 font-medium mb-6">{profileData.role}</p>

                        <div className="space-y-2 mb-6 text-left">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Profile Completion</span>
                                <span className="text-purple-400 font-bold">{completionPercentage}%</span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${completionPercentage}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                                />
                            </div>
                        </div>

                        <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors font-medium text-sm flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Upload Resume
                        </button>
                    </motion.div>

                    {/* Progress Metrics Module */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card rounded-3xl p-6 border border-white/10"
                    >
                        <h3 className="text-lg font-bold mb-4">Activity Overview</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">12</div>
                                <div className="text-xs text-gray-400 mt-1">Mock Interviews</div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">85</div>
                                <div className="text-xs text-gray-400 mt-1">Avg Score</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Profile Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="md:w-2/3 glass-card rounded-3xl p-8 border border-white/10"
                >
                    <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                        <h2 className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Profile Details</h2>
                        <button
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            className={`px-4 py-2 rounded-xl font-medium transition-all text-sm ${isEditing ? 'bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-500/25' : 'bg-white/5 hover:bg-white/10 border border-white/10'}`}
                        >
                            {isEditing ? 'Save Changes' : 'Edit Profile'}
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                    />
                                ) : (
                                    <p className="px-4 py-2 bg-white/5 border border-transparent rounded-xl text-gray-200">{profileData.name}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                                <p className="px-4 py-2 bg-white/5 border border-transparent rounded-xl text-gray-400 cursor-not-allowed">
                                    {profileData.email}
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Target Career Domain</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profileData.targetDomain}
                                    onChange={(e) => setProfileData({ ...profileData, targetDomain: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                />
                            ) : (
                                <p className="px-4 py-2 bg-white/5 border border-transparent rounded-xl text-gray-200">{profileData.targetDomain || 'Not specified'}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Top Skills</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profileData.skills}
                                    onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                />
                            ) : (
                                <div className="flex flex-wrap gap-2 px-1 py-1">
                                    {profileData.skills.split(',').map((skill, i) => (
                                        <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm border border-purple-500/20">
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Experience Level</label>
                                {isEditing ? (
                                    <select
                                        value={profileData.experienceLevel}
                                        onChange={(e) => setProfileData({ ...profileData, experienceLevel: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#1e132c] border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                    >
                                        <option value="Entry Level">Entry Level</option>
                                        <option value="Mid Level">Mid Level</option>
                                        <option value="Senior Level">Senior Level</option>
                                    </select>
                                ) : (
                                    <p className="px-4 py-2 bg-white/5 border border-transparent rounded-xl text-gray-200">{profileData.experienceLevel || 'Not specified'}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Preferred Interview Role</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profileData.preferredInterviewRole}
                                        onChange={(e) => setProfileData({ ...profileData, preferredInterviewRole: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                    />
                                ) : (
                                    <p className="px-4 py-2 bg-white/5 border border-transparent rounded-xl text-gray-200">{profileData.preferredInterviewRole || 'Not specified'}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Learning Goals</label>
                            {isEditing ? (
                                <textarea
                                    rows={3}
                                    value={profileData.learningGoals}
                                    onChange={(e) => setProfileData({ ...profileData, learningGoals: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none"
                                />
                            ) : (
                                <p className="px-4 py-3 bg-white/5 border border-transparent rounded-xl text-gray-200">{profileData.learningGoals || 'No goals set'}</p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
