'use client';

import Link from 'next/link';
import ProjectGeneratorForm from '@/modules/career/project-generator/components/ProjectGeneratorForm';
import ProjectResultsList from '@/modules/career/project-generator/components/ProjectResultsList';
import { useProjectGeneratorStore } from '@/modules/career/project-generator/store/useProjectGeneratorStore';

export default function AIProjectGeneratorPage() {
    const { projects } = useProjectGeneratorStore();

    return (
        <div className="min-h-screen bg-[#0A0118] text-white/90 p-4 md:p-8 animate-fade-in">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <Link href="/dashboard/career" className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors group">
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        <span className="text-sm font-medium">Back to Career Dashboard</span>
                    </Link>
                    
                    <div className="flex flex-col gap-2 relative z-10">
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
                            AI Project Generator
                        </h1>
                        <p className="text-lg text-white/60 max-w-2xl leading-relaxed">
                            Stop building repetitive projects. Input your engineering branch and stack, and our Principal Engineering AI engine will spin up custom, industry-relevant capstone projects designed to instantly boost your resume weightage and placement chances.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-8 items-start relative z-10 w-full">
                    {/* Left Panel: Form */}
                    <div className={`w-full transition-all duration-500 ease-in-out ${projects.length > 0 ? 'xl:w-[400px] flex-shrink-0 opacity-80 hover:opacity-100' : 'max-w-xl mx-auto'}`}>
                        <ProjectGeneratorForm />
                    </div>

                    {/* Right Panel: Results */}
                    {projects.length > 0 && (
                        <div className="flex-grow w-full h-full pb-32">
                            <ProjectResultsList />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
