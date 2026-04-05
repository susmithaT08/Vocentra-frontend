'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiUrl } from '@/lib/api';

function VerifyForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (!userId) {
            router.push('/login');
        }
    }, [userId, router]);

    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpString = otp.join('');

        if (otpString.length !== 6) {
            setError('Please enter a valid 6-digit OTP.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch(apiUrl('/api/auth/verify'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, otp: otpString }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Verification failed');

            // Save token
            if (typeof window !== 'undefined') {
                localStorage.setItem('vocentra_token', data.token);
                document.cookie = `vocentra_token=${data.token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
            }

            // Route based on onboarding status
            if (data.isOnboardingComplete) {
                router.push('/dashboard/profile');
            } else {
                router.push('/onboarding');
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="w-16 h-16 bg-violet-600/20 border border-violet-500/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </div>

            <h2 className="text-3xl font-display font-semibold mb-2 text-white">Check your email</h2>
            <p className="text-white/50 mb-8 text-sm">
                Enter the 6-digit verification code sent to your email.
            </p>

            {error && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-sm mb-6 flex items-center gap-3 animate-fade-in shadow-[0_0_15px_rgba(244,63,94,0.1)] text-left">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {error}
                </div>
            )}

            <form onSubmit={handleVerify}>
                <div className="flex justify-center gap-2 sm:gap-3 mb-8">
                    {otp.map((digit, index) => (
                        <div key={index} className="relative group/input">
                            <input
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-semibold bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all text-white placeholder-white/30 hover:bg-white/10 hover:border-white/20"
                            />
                        </div>
                    ))}
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full relative overflow-hidden group bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <span className={`flex justify-center items-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
                            Verify Account <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
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
                </div>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5">
                <div className="text-sm text-white/50">
                    Didn't receive the email? <button type="button" className="text-violet-400 font-medium hover:text-violet-300 transition-colors ml-1 hover:underline">Resend code</button>
                </div>
                <div className="mt-3 text-xs text-indigo-400/80 font-medium italic">
                    (Hint: Check the Node.js backend terminal for the Mock OTP code)
                </div>
            </div>
        </>
    );
}

export default function VerifyPage() {
    return (
        <div className="relative group perspective-1000">
            {/* Glow effect behind the card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

            <div className="relative glass-card rounded-3xl shadow-2xl overflow-hidden animate-slide-up border border-white/10 bg-black/40">
                <div className="p-8 sm:p-10 text-center">
                    <Suspense fallback={
                        <div className="flex justify-center items-center py-12 text-violet-400">
                            <svg className="animate-spin -ml-1 mr-3 h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="font-medium">Loading verification portal...</span>
                        </div>
                    }>
                        <VerifyForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
