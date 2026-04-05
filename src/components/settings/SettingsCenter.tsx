'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsCenter() {
    const [activeTab, setActiveTab] = useState('security');

    const [settings, setSettings] = useState({
        twoFactorAuth: false,
        emailAlerts: true,
        interviewReminders: true,
        recommendations: true,
        profileVisibility: true,
        theme: 'dark',
        language: 'en'
    });

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const tabs = [
        { id: 'security', label: 'Security & Login' },
        { id: 'notifications', label: 'Notifications' },
        { id: 'privacy', label: 'Privacy & Data' },
        { id: 'preferences', label: 'Preferences' },
    ];

    const tabVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6 text-white min-h-[80vh]">
            <div className="mb-10">
                <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-indigo-200 mb-2">
                    Settings Center
                </h1>
                <p className="text-gray-400 text-sm">Manage your account security, notifications, and preferences.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="md:w-64 shrink-0">
                    <nav className="flex flex-col gap-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`text-left px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm ${activeTab === tab.id
                                        ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-[0_0_15px_rgba(147,51,234,0.1)]'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                        {/* Decorative blur */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/10 blur-[80px] rounded-full pointer-events-none"></div>

                        <AnimatePresence mode="wait">
                            {activeTab === 'security' && (
                                <motion.div key="security" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8 relative z-10">
                                    <div>
                                        <h2 className="text-xl font-bold mb-4">Password & Authentication</h2>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                                                <div>
                                                    <h3 className="font-medium text-gray-200">Change Password</h3>
                                                    <p className="text-sm text-gray-400">Update your password to keep your account secure.</p>
                                                </div>
                                                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">Update</button>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                                                <div>
                                                    <h3 className="font-medium text-gray-200">Two-Factor Authentication</h3>
                                                    <p className="text-sm text-gray-400">Add an extra layer of security to your account.</p>
                                                </div>
                                                <button
                                                    onClick={() => toggleSetting('twoFactorAuth')}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.twoFactorAuth ? 'bg-purple-600' : 'bg-gray-600'}`}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-bold mb-4">Active Sessions</h2>
                                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                    💻
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-200">Windows PC - Chrome</h3>
                                                    <p className="text-sm text-green-400">Active Now • Mumbai, India</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'notifications' && (
                                <motion.div key="notifications" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6 relative z-10">
                                    <h2 className="text-xl font-bold mb-4">Notification Preferences</h2>

                                    <div className="space-y-4">
                                        {[
                                            { key: 'emailAlerts', title: 'Email Alerts', desc: 'Receive updates about your account activity.' },
                                            { key: 'interviewReminders', title: 'Interview Reminders', desc: 'Get notified before your scheduled mock interviews.' },
                                            { key: 'recommendations', title: 'Personalized Recommendations', desc: 'Receive tailored job role and skill suggestions.' }
                                        ].map((item) => (
                                            <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                                                <div>
                                                    <h3 className="font-medium text-gray-200">{item.title}</h3>
                                                    <p className="text-sm text-gray-400">{item.desc}</p>
                                                </div>
                                                <button
                                                    onClick={() => toggleSetting(item.key as keyof typeof settings)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings[item.key as keyof typeof settings] ? 'bg-purple-600' : 'bg-gray-600'}`}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings[item.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'privacy' && (
                                <motion.div key="privacy" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8 relative z-10">
                                    <div>
                                        <h2 className="text-xl font-bold mb-4">Profile Privacy</h2>
                                        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                                            <div>
                                                <h3 className="font-medium text-gray-200">Public Profile</h3>
                                                <p className="text-sm text-gray-400">Allow recruiters to find your profile on Vocentra.</p>
                                            </div>
                                            <button
                                                onClick={() => toggleSetting('profileVisibility')}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.profileVisibility ? 'bg-purple-600' : 'bg-gray-600'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.profileVisibility ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-bold mb-4 text-red-400">Danger Zone</h2>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 border border-red-500/30 bg-red-500/5 rounded-xl">
                                                <div>
                                                    <h3 className="font-medium text-gray-200">Export User Data</h3>
                                                    <p className="text-sm text-gray-400">Download all information associated with your account.</p>
                                                </div>
                                                <button className="px-4 py-2 border border-white/20 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">Request Data</button>
                                            </div>
                                            <div className="flex items-center justify-between p-4 border border-red-500/50 bg-red-500/10 rounded-xl">
                                                <div>
                                                    <h3 className="font-medium text-red-200">Delete Account</h3>
                                                    <p className="text-sm text-red-300">Permanently remove your account and all associated data.</p>
                                                </div>
                                                <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-red-500/20">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'preferences' && (
                                <motion.div key="preferences" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6 relative z-10">
                                    <h2 className="text-xl font-bold mb-4">App Preferences</h2>

                                    <div className="space-y-6">
                                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                            <h3 className="font-medium text-gray-200 mb-4">Theme</h3>
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => setSettings({ ...settings, theme: 'dark' })}
                                                    className={`px-6 py-2 rounded-lg font-medium text-sm transition-colors border ${settings.theme === 'dark' ? 'bg-purple-600/20 border-purple-500 text-purple-300' : 'bg-transparent border-white/20 text-gray-400 hover:bg-white/5'}`}
                                                >
                                                    Dark Mode
                                                </button>
                                                <button
                                                    onClick={() => setSettings({ ...settings, theme: 'light' })}
                                                    className={`px-6 py-2 rounded-lg font-medium text-sm transition-colors border ${settings.theme === 'light' ? 'bg-purple-600/20 border-purple-500 text-purple-300' : 'bg-transparent border-white/20 text-gray-400 hover:bg-white/5'}`}
                                                >
                                                    Light Mode
                                                </button>
                                                <button
                                                    onClick={() => setSettings({ ...settings, theme: 'system' })}
                                                    className={`px-6 py-2 rounded-lg font-medium text-sm transition-colors border ${settings.theme === 'system' ? 'bg-purple-600/20 border-purple-500 text-purple-300' : 'bg-transparent border-white/20 text-gray-400 hover:bg-white/5'}`}
                                                >
                                                    System
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                            <h3 className="font-medium text-gray-200 mb-2">Language</h3>
                                            <p className="text-sm text-gray-400 mb-4">Choose your preferred language for the interface.</p>
                                            <select
                                                value={settings.language}
                                                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                                                className="w-full md:w-1/2 px-4 py-2 bg-[#1e132c] border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-white"
                                            >
                                                <option value="en">English (US)</option>
                                                <option value="es">Español</option>
                                                <option value="fr">Français</option>
                                                <option value="hi">हिंदी</option>
                                            </select>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
