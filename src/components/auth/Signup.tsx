'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthLayout from './AuthLayout';
import { motion } from 'framer-motion';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Password strength logic
    const [strength, setStrength] = useState(0);

    useEffect(() => {
        let sc = 0;
        if (password.length > 5) sc += 1;
        if (password.length > 8) sc += 1;
        if (/[A-Z]/.test(password)) sc += 1;
        if (/[0-9]/.test(password)) sc += 1;
        if (/[^A-Za-z0-9]/.test(password)) sc += 1;
        setStrength(Math.min(sc, 4));
    }, [password]);

    const strengthColors = ['bg-gray-500', 'bg-red-500', 'bg-yellow-500', 'bg-green-400', 'bg-green-500'];
    const strengthLabels = ['Too Weak', 'Weak', 'Fair', 'Good', 'Strong'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => setIsLoading(false), 1500);
    };

    return (
        <AuthLayout
            title="Create an Account"
            subtitle="Join Vocentra and accelerate your career"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-white placeholder-gray-500"
                        placeholder="John Doe"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-white placeholder-gray-500"
                        placeholder="you@example.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-white placeholder-gray-500"
                        placeholder="••••••••"
                    />

                    {/* Password Strength Indicator */}
                    {password && (
                        <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 flex gap-1 h-1.5">
                                {[1, 2, 3, 4].map((level) => (
                                    <div
                                        key={level}
                                        className={`flex-1 rounded-full transition-colors duration-300 ${strength >= level ? strengthColors[strength] : 'bg-white/10'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className={`text-xs font-medium w-16 text-right ${strength <= 1 ? 'text-red-400' :
                                    strength === 2 ? 'text-yellow-400' : 'text-green-400'
                                }`}>
                                {strengthLabels[strength]}
                            </span>
                        </div>
                    )}
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading || strength < 2}
                    className="w-full py-3 mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        "Create Account"
                    )}
                </motion.button>
            </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-[#1a1025] text-gray-400">Or sign up with</span>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                    {/* Google & LinkedIn Buttons identical to Login */}
                    <button className="flex items-center justify-center px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group">
                        <span className="text-sm font-medium text-gray-300 group-hover:text-white">Google</span>
                    </button>
                    <button className="flex items-center justify-center px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group">
                        <span className="text-sm font-medium text-gray-300 group-hover:text-white">LinkedIn</span>
                    </button>
                </div>
            </div>

            <p className="mt-6 text-center text-sm text-gray-400">
                Already have an account?{' '}
                <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                    Log in
                </Link>
            </p>
        </AuthLayout>
    );
}
