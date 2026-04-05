"use client";

import ModuleCard from '@/components/ModuleCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PersonalityPage() {
    const router = useRouter();

    return (
        <div className="animate-slide-up">
            <div className="mb-8">
                <Link href="/dashboard" className="flex items-center gap-2 text-white/50 hover:text-white mb-4 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    <span className="text-sm">Back to Dashboard</span>
                </Link>
                <h2 className="font-display text-3xl font-semibold text-white mb-2">Personality Development</h2>
                <p className="text-white/50">Discover and enhance your unique qualities</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ModuleCard
                    title="Emotional Intelligence"
                    description="Develop self-awareness, empathy, and emotional regulation skills."
                    icon={<span className="text-2xl">🌟</span>}
                    color="amber"
                    metadata="5 modules"
                    onClick={() => router.push('/dashboard/personality/emotional-intelligence')}
                />
                <ModuleCard
                    title="Confidence Building"
                    description="Overcome self-doubt and develop a strong, positive self-image."
                    icon={<span className="text-2xl">✨</span>}
                    color="pink"
                    metadata="7 exercises"
                    onClick={() => router.push('/dashboard/personality/confidence-building')}
                />
                <ModuleCard
                    title="Social Skills"
                    description="Master networking, small talk, and building meaningful connections."
                    icon={<span className="text-2xl">🤝</span>}
                    color="indigo"
                    metadata="6 scenarios"
                    onClick={() => router.push('/dashboard/personality/social-skills')}
                />
                <ModuleCard
                    title="Self-Discovery"
                    description="Explore your values, strengths, and unique personal identity."
                    icon={<span className="text-2xl">🧭</span>}
                    color="teal"
                    metadata="4 assessments"
                    onClick={() => router.push('/dashboard/personality/self-discovery')}
                />
            </div>
        </div>
    );
}
