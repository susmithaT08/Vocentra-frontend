'use client';

import { useProjectGeneratorStore } from '../store/useProjectGeneratorStore';
import { useProgressStore } from '@/store/useProgressStore';

export default function ProjectResultsList() {
    const { projects, startedProjects, completedProjects, markStarted, markCompleted, clearProjects, error } = useProjectGeneratorStore();

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-400">
                <svg className="w-8 h-8 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
                <button onClick={clearProjects} className="block mx-auto mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white transition-colors">Try Again</button>
            </div>
        );
    }

    if (!projects || projects.length === 0) return null;

    const handleAction = (id: string, action: 'start' | 'complete') => {
        if (action === 'start') {
            markStarted(id);
            // Sync read-only progress to the dashboard globally
            useProgressStore.getState().incrementMetric('career', 2, { action: 'project_started' });
        } else {
            markCompleted(id);
            // Sync read-only progress to the dashboard globally
            useProgressStore.getState().incrementMetric('career', 5, { action: 'project_completed' });
        }
    };

    return (
        <div className="space-y-6 w-full max-w-4xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-semibold text-emerald-400">Generated Projects ({projects.length})</h3>
                <button onClick={clearProjects} className="text-white/50 hover:text-white text-sm transition-colors border border-white/10 px-4 py-2 rounded-lg hover:bg-white/5">
                    Clear Results
                </button>
            </div>
            
            {projects.map((proj) => (
                <div key={proj.id} className="bg-slate-900 border border-white/5 hover:border-emerald-500/30 transition-colors rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-50 text-right space-y-1">
                        <div className={`text-xs px-2 py-1 rounded-full border inline-block ${
                            proj.placementWeightage?.level === 'High' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 
                            proj.placementWeightage?.level === 'Medium' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 
                            'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}>
                            {proj.placementWeightage?.level || 'Standard'} Placement Value
                        </div>
                        <div className="text-xs font-semibold text-indigo-300">
                            Resume Weightage: {proj.resumeWeightage?.score || 0}/10
                        </div>
                    </div>

                    <div className="pr-32">
                        <h4 className="text-xl font-bold text-white mb-2">{proj.title}</h4>
                        <div className="bg-emerald-500/10 text-emerald-300 px-3 py-1 rounded border border-emerald-500/20 inline-block text-xs uppercase tracking-wider font-semibold mb-4">
                            {proj.difficulty?.level || 'Intermediate'}
                        </div>
                        
                        <p className="text-white/80 mb-4 text-sm leading-relaxed border-l-2 border-white/20 pl-4 italic">
                            {proj.problemStatement || 'No description provided.'}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6 pt-4 border-t border-white/10">
                        <div>
                            <h5 className="text-sm font-semibold text-white/50 mb-2 uppercase tracking-wider">Key Features</h5>
                            <ul className="space-y-1 text-sm text-white/80">
                                {proj.keyFeatures?.map((feat, i) => <li key={i} className="flex items-start"><span className="text-emerald-400 mr-2 mt-0.5">•</span> <span>{feat}</span></li>) || <li>No features listed.</li>}
                            </ul>
                        </div>
                        <div>
                            <h5 className="text-sm font-semibold text-white/50 mb-2 uppercase tracking-wider">Tech Stack</h5>
                            <div className="flex flex-wrap gap-2">
                                {proj.techStack?.map((tech, i) => (
                                    <span key={i} className="px-2 py-1 bg-black/40 border border-white/10 rounded-md text-xs text-sky-200">{tech}</span>
                                )) || <span className="text-white/30 italic">No stack specified.</span>}
                            </div>
                        </div>
                    </div>

                    <div className="bg-black/30 p-4 rounded-xl text-sm mb-6 space-y-3">
                        <p><span className="text-white/50">Difficulty Justification:</span> <span className="text-white/80">{proj.difficulty?.justification || 'N/A'}</span></p>
                        <p><span className="text-white/50">Resume Justification:</span> <span className="text-white/80">{proj.resumeWeightage?.reasoning || 'N/A'}</span></p>
                        <p><span className="text-white/50">Industry Context:</span> <span className="text-white/80">{proj.placementWeightage?.explanation || 'N/A'}</span></p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        {completedProjects[proj.id] ? (
                            <span className="px-4 py-2 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-semibold rounded-lg text-sm flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                Completed
                            </span>
                        ) : startedProjects[proj.id] ? (
                            <button 
                                onClick={() => handleAction(proj.id, 'complete')}
                                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg text-sm transition-colors shadow-lg shadow-emerald-500/20"
                            >
                                Mark as Completed (+5 XP)
                            </button>
                        ) : (
                            <button 
                                onClick={() => handleAction(proj.id, 'start')}
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-sm transition-colors shadow-lg shadow-indigo-500/20"
                            >
                                Start Project (+2 XP)
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
