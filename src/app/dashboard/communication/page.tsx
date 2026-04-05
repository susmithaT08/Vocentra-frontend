'use client';

import ModuleCard from '@/components/ModuleCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CommunicationPage() {
    const router = useRouter();
    return (
        <div className="animate-slide-up">
            <div className="mb-8">
                <Link href="/dashboard" className="flex items-center gap-2 text-white/50 hover:text-white mb-4 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    <span className="text-sm">Back to Dashboard</span>
                </Link>
                <h2 className="font-display text-3xl font-semibold text-white mb-2">Language &amp; Communication</h2>
                <p className="text-white/50">Master the art of effective expression</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ModuleCard
                    title="Speaking Practice"
                    description="AI-powered pronunciation feedback and fluency training with real-time analysis."
                    icon={<span className="text-2xl">🎤</span>}
                    color="emerald"
                    metadata="8 sessions"
                    onClick={() => router.push('/dashboard/communication/speaking')}
                />
                <ModuleCard
                    title="Vocabulary Builder"
                    description="Expand your word power with contextual learning and spaced repetition."
                    icon={<span className="text-2xl">📚</span>}
                    color="blue"
                    metadata="12 sessions"
                    onClick={() => router.push('/dashboard/communication/vocabulary-builder')}
                />
                <ModuleCard
                    title="Grammar Correction"
                    description="Write with confidence using intelligent grammar checking and suggestions."
                    icon={<span className="text-2xl">✏️</span>}
                    color="purple"
                    metadata="5 sessions"
                    onClick={() => router.push('/dashboard/communication/grammar-correction')}
                />
                <ModuleCard
                    title="Conversation Practice"
                    description="Engage in realistic dialogues with AI to build natural communication skills."
                    icon={<span className="text-2xl">💬</span>}
                    color="cyan"
                    metadata="10 scenarios"
                    onClick={() => router.push('/dashboard/communication/conversation-practice')}
                />
            </div>
        </div>
    );
}
