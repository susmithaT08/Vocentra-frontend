'use client';

import ModuleCard from '@/components/ModuleCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ConfidencePage() {
    const router = useRouter();
    return (
        <div className="animate-slide-up">
            <div className="mb-8">
                <Link href="/dashboard" className="flex items-center gap-2 text-white/50 hover:text-white mb-4 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    <span className="text-sm">Back to Dashboard</span>
                </Link>
                <h2 className="font-display text-3xl font-semibold text-white mb-2">Confidence Building</h2>
                <p className="text-white/50">Own your journey and step into your full potential</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ModuleCard
                    title="Public Speaking"
                    description="Master the stage and convey your message powerfully."
                    icon={<span className="text-2xl">🗣️</span>}
                    color="fuchsia"
                    metadata="10 exercises"
                    onClick={() => router.push('/dashboard/confidence/public-speaking')}
                />
                <ModuleCard
                    title="Mindset Shifts"
                    description="Transform limiting beliefs into affirming principles."
                    icon={<span className="text-2xl">🧠</span>}
                    color="yellow"
                    metadata="Daily habits"
                    onClick={() => router.push('/dashboard/confidence/mindset-shifts')}
                />
            </div>
        </div>
    );
}
