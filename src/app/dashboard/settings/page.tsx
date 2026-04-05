'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/lib/api';

export default function SettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('security');

    // Form States
    const [security, setSecurity] = useState({ currentPassword: '', newPassword: '' });
    const [notifications, setNotifications] = useState({ emailAlerts: true, interviewReminders: true, recommendations: true });
    const [privacy, setPrivacy] = useState({ profileVisibility: true, dataExport: true });
    const [preferences, setPreferences] = useState({ theme: 'system', language: 'en' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('vocentra_token');
            if (!token) return router.push('/login');

            const res = await fetch(apiUrl('/api/users/profile'), {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
                if (data.notifications) setNotifications(data.notifications);
                if (data.privacy) setPrivacy(data.privacy);
                setPreferences({ theme: data.theme || 'system', language: data.language || 'en' });
            }
        } catch (error) {
            console.error('Failed to fetch profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async (section: string, data: any) => {
        try {
            const token = localStorage.getItem('vocentra_token');
            const res = await fetch(apiUrl('/api/users/profile'), {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ [section]: data })
            });
            if (res.ok) {
                alert('Settings saved successfully!');
            }
        } catch (error) {
            console.error('Failed to update settings', error);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;

    const tabs = [
        { id: 'security', label: 'Security & Access', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
        { id: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
        { id: 'privacy', label: 'Privacy & Data', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
        { id: 'preferences', label: 'App Preferences', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    ];

    // Custom Toggle Component
    const Toggle = ({ active, onChange }: { active: boolean, onChange: () => void }) => (
        <button
            onClick={onChange}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${active ? 'bg-violet-600 shadow-[0_0_10px_rgba(139,92,246,0.5)]' : 'bg-gray-700'}`}
        >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${active ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    );

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative min-h-screen">
            {/* Background Glows */}
            <div className="absolute top-20 right-10 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

            <div className="mb-10 relative z-10">
                <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
                    <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    Settings Hub
                </h1>
                <p className="text-white/50 text-sm mt-1 ml-11">Configure your Vocentra experience</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 relative z-10">
                {/* Sidebar */}
                <div className="w-full md:w-64 shrink-0">
                    <div className="glass-card rounded-2xl shadow-2xl border border-white/10 bg-black/40 overflow-hidden flex flex-col p-2 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full text-left px-4 py-3.5 rounded-xl transition-all duration-300 flex items-center gap-3 group ${activeTab === tab.id
                                        ? 'bg-violet-600/20 shadow-[inset_0_0_20px_rgba(139,92,246,0.1)] border border-violet-500/30 text-white'
                                        : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <svg className={`w-5 h-5 transition-colors duration-300 ${activeTab === tab.id ? 'text-violet-400' : 'text-white/30 group-hover:text-white/70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                                </svg>
                                <span className="font-medium text-sm">{tab.label}</span>
                                {activeTab === tab.id && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.8)] animate-pulse"></span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 glass-card rounded-3xl shadow-2xl border border-white/10 bg-black/40 p-6 sm:p-10 min-h-[500px] relative overflow-hidden">
                    {/* Inner subtle glow based on active tab */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 blur-[100px] rounded-full pointer-events-none transition-all duration-1000"></div>

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="animate-fade-in">
                            <h2 className="text-xl font-semibold mb-8 text-white flex items-center gap-2">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                Password & Authentication
                            </h2>
                            <div className="max-w-md space-y-6 mb-10">
                                <div>
                                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Current Password</label>
                                    <input
                                        type="password"
                                        value={security.currentPassword}
                                        onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all focus:bg-white/10 placeholder-white/20"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2 block">New Password</label>
                                    <input
                                        type="password"
                                        value={security.newPassword}
                                        onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all focus:bg-white/10 placeholder-white/20"
                                        placeholder="Enter new password"
                                    />
                                </div>
                                <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl font-medium transition-colors shadow-lg text-sm">
                                    Update Password
                                </button>
                            </div>

                            <div className="h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent my-10"></div>

                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-white flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                    Two-Factor Authentication
                                </h3>
                                <p className="text-white/50 text-sm mb-6 max-w-lg">Protect your account from unauthorized access. We'll require a verification code anytime you sign in from a new device.</p>
                                <button className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-medium transition-colors shadow-[0_0_15px_rgba(139,92,246,0.3)] text-sm">
                                    Setup 2FA
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="animate-fade-in relative">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                    Communication Preferences
                                </h2>
                                <button
                                    onClick={() => handleSaveSettings('notifications', notifications)}
                                    className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl font-medium transition-colors shadow-lg text-sm"
                                >
                                    Save Changes
                                </button>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                    <div>
                                        <div className="font-medium text-white mb-1">Critical Account Alerts</div>
                                        <div className="text-sm text-white/50">Security notices, password resets, and login attempts.</div>
                                    </div>
                                    <Toggle active={notifications.emailAlerts} onChange={() => setNotifications({ ...notifications, emailAlerts: !notifications.emailAlerts })} />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                    <div>
                                        <div className="font-medium text-white mb-1">Interview Reminders</div>
                                        <div className="text-sm text-white/50">Get notified 24h before scheduled AI mock interviews.</div>
                                    </div>
                                    <Toggle active={notifications.interviewReminders} onChange={() => setNotifications({ ...notifications, interviewReminders: !notifications.interviewReminders })} />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                    <div>
                                        <div className="font-medium text-white mb-1">Learning Recommendations</div>
                                        <div className="text-sm text-white/50">Receive personalized weekly tips and module suggestions.</div>
                                    </div>
                                    <Toggle active={notifications.recommendations} onChange={() => setNotifications({ ...notifications, recommendations: !notifications.recommendations })} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Privacy Tab */}
                    {activeTab === 'privacy' && (
                        <div className="animate-fade-in relative">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
                                    Data & Visibility
                                </h2>
                                <button
                                    onClick={() => handleSaveSettings('privacy', privacy)}
                                    className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl font-medium transition-colors shadow-lg text-sm"
                                >
                                    Save Changes
                                </button>
                            </div>

                            <div className="space-y-6 mb-12">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                    <div>
                                        <div className="font-medium text-white mb-1">Public Profile Visibility</div>
                                        <div className="text-sm text-white/50">Allow recruiters and network peers to discover your portfolio.</div>
                                    </div>
                                    <Toggle active={privacy.profileVisibility} onChange={() => setPrivacy({ ...privacy, profileVisibility: !privacy.profileVisibility })} />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                    <div>
                                        <div className="font-medium text-white mb-1">Usage Data Collection</div>
                                        <div className="text-sm text-white/50">Allow Vocentra to use your interaction data to improve our AI models.</div>
                                    </div>
                                    <Toggle active={privacy.dataExport} onChange={() => setPrivacy({ ...privacy, dataExport: !privacy.dataExport })} />
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] rounded-full pointer-events-none"></div>
                                <h3 className="text-lg font-semibold mb-2 text-red-400">Danger Zone</h3>
                                <p className="text-white/60 text-sm mb-6 max-w-xl">Permanently delete your account, generated resumes, and interview history. This action strictly cannot be undone.</p>
                                <button className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl font-medium transition-colors text-sm">
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Preferences Tab */}
                    {activeTab === 'preferences' && (
                        <div className="animate-fade-in relative">
                            <h2 className="text-xl font-semibold mb-8 text-white flex items-center gap-2">
                                <svg className="w-5 h-5 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                                Interface Customization
                            </h2>
                            <div className="space-y-8 max-w-xl">
                                <div>
                                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-3 block">Color Theme</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {['system', 'light', 'dark'].map((theme) => (
                                            <button
                                                key={theme}
                                                onClick={() => setPreferences({ ...preferences, theme })}
                                                className={`relative py-3 px-4 rounded-xl text-sm font-medium capitalize transition-all duration-300 overflow-hidden ${preferences.theme === theme
                                                        ? 'bg-white/10 border-violet-500/50 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                                                        : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20'
                                                    } border`}
                                            >
                                                {theme === 'dark' && <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black -z-10 opacity-50"></div>}
                                                {theme === 'light' && <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white -z-10 opacity-50 text-gray-900"></div>}
                                                {theme}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-white/30 mt-3">Note: The current Vocentra premium design primarily targets Dark Mode.</p>
                                </div>

                                <div className="h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent my-8"></div>

                                <div>
                                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-3 block">Language & Region</label>
                                    <div className="relative">
                                        <select
                                            value={preferences.language}
                                            onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                                            className="w-full appearance-none bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all focus:bg-white/10"
                                        >
                                            <option value="en" className="bg-gray-900 text-white">English (US)</option>
                                            <option value="es" className="bg-gray-900 text-white">Español</option>
                                            <option value="fr" className="bg-gray-900 text-white">Français</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-white/50">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        onClick={() => handleSaveSettings('preferences', preferences)}
                                        className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-medium transition-colors shadow-[0_0_15px_rgba(139,92,246,0.3)] text-sm"
                                    >
                                        Save App Preferences
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
