'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnboardingWizard() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        education: '',
        targetDomain: '',
        skills: '',
        experienceLevel: '',
        preferredInterviewRole: '',
        learningGoals: ''
    });

    const updateForm = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = () => {
        // Submit profile data to complete onboarding
        console.log("Onboarding Complete", formData);
    };

    const renderStepIndicators = () => (
        <div className="flex items-center justify-center mb-10 w-full max-w-sm mx-auto">
            {[1, 2, 3].map((num) => (
                <React.Fragment key={num}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${step >= num ? 'bg-purple-600 border-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]' : 'bg-transparent border-white/20 text-gray-400'}`}>
                        {num}
                    </div>
                    {num < 3 && (
                        <div className={`flex-1 h-0.5 mx-2 transition-colors duration-300 ${step > num ? 'bg-purple-600' : 'bg-white/10'}`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/30 rounded-full blur-[120px] mix-blend-screen"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/30 rounded-full blur-[120px] mix-blend-screen"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl relative z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-indigo-200 mb-3">
                        Set Up Your Profile
                    </h1>
                    <p className="text-gray-400 max-w-lg mx-auto">Let's personalize your Vocentra experience to help you achieve your career goals faster.</p>
                </div>

                <div className="glass-card rounded-2xl p-8 sm:p-10 shadow-2xl border border-white/10 backdrop-blur-xl bg-white/5 relative overflow-hidden">
                    {renderStepIndicators()}

                    <div className="min-h-[300px]">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    variants={stepVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">How should we call you?</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => updateForm('name', e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white"
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">What best describes you?</label>
                                        <select
                                            value={formData.role}
                                            onChange={(e) => updateForm('role', e.target.value)}
                                            className="w-full px-4 py-3 bg-[#1e132c] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white appearance-none"
                                        >
                                            <option value="">Select your role</option>
                                            <option value="student">Student</option>
                                            <option value="job seeker">Job Seeker</option>
                                            <option value="professional">Professional</option>
                                        </select>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    variants={stepVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-xl font-semibold text-white mb-4">Career Details</h2>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Highest Education Level</label>
                                        <input
                                            type="text"
                                            value={formData.education}
                                            onChange={(e) => updateForm('education', e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white"
                                            placeholder="e.g. B.S. in Computer Science"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Target Career Domain</label>
                                        <input
                                            type="text"
                                            value={formData.targetDomain}
                                            onChange={(e) => updateForm('targetDomain', e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white"
                                            placeholder="e.g. Software Engineering, Marketing"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Top Skills (comma separated)</label>
                                        <input
                                            type="text"
                                            value={formData.skills}
                                            onChange={(e) => updateForm('skills', e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white"
                                            placeholder="e.g. React, Node.js, Python"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    variants={stepVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-xl font-semibold text-white mb-4">Preferences & Goals</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Experience Level</label>
                                            <select
                                                value={formData.experienceLevel}
                                                onChange={(e) => updateForm('experienceLevel', e.target.value)}
                                                className="w-full px-4 py-3 bg-[#1e132c] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white appearance-none"
                                            >
                                                <option value="">Select level</option>
                                                <option value="entry">Entry Level (0-2 years)</option>
                                                <option value="mid">Mid Level (3-5 years)</option>
                                                <option value="senior">Senior Level (5+ years)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Mock Interview Role</label>
                                            <input
                                                type="text"
                                                value={formData.preferredInterviewRole}
                                                onChange={(e) => updateForm('preferredInterviewRole', e.target.value)}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white"
                                                placeholder="e.g. Frontend Developer"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Learning Goals (comma separated)</label>
                                        <input
                                            type="text"
                                            value={formData.learningGoals}
                                            onChange={(e) => updateForm('learningGoals', e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white"
                                            placeholder="e.g. Improve system design, Ace technical interviews"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mt-10 pt-6 border-t border-white/10 flex justify-between">
                        <button
                            onClick={prevStep}
                            className={`px-6 py-2.5 rounded-xl font-medium transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                        >
                            Back
                        </button>

                        {step < 3 ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={nextStep}
                                className="px-8 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-purple-500/30"
                            >
                                Continue
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSubmit}
                                className="px-8 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-green-500/30"
                            >
                                Complete Profile
                            </motion.button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
