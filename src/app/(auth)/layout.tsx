import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Authentication | Vocentra',
    description: 'Login or Sign up for Vocentra',
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
            {/* Ambient Background Elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" style={{ animation: 'float 6s ease-in-out infinite reverse' }}></div>

            <div className="w-full max-w-md relative z-10 animate-slide-up">
                <div className="mb-8 text-center space-y-3">
                    <div className="inline-flex items-center justify-center p-3 mb-2 rounded-2xl bg-white/5 border border-white/10 shadow-xl backdrop-blur-md">
                        <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400">Vocentra</h1>
                    <p className="text-white/60 text-sm font-medium tracking-wide uppercase">AI Career Intelligence</p>
                </div>
                {children}
            </div>
        </div>
    );
}
