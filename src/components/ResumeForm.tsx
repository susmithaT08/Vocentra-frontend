import React, { useState } from 'react';

interface ResumeFormProps {
    onSubmit: (data: unknown) => void;
    onCancel: () => void;
    isLoading: boolean;
}

export default function ResumeForm({ onSubmit, onCancel, isLoading }: ResumeFormProps) {
    const [formData, setFormData] = useState({
        title: '',
        fullName: '',
        email: '',
        phone: '',
        linkedin: '',
        targetJobRole: '',
        careerObjective: '',
        education: '',
        skills: '',
        experience: '',
        projects: '',
        certifications: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Convert comma-separated strings to arrays
        const processArrayField = (fieldStr: string) => {
            if (!fieldStr.trim()) return [];
            return fieldStr.split(',').map(item => item.trim()).filter(item => item !== '');
        };

        const processedData = {
            ...formData,
            education: processArrayField(formData.education),
            skills: processArrayField(formData.skills),
            experience: processArrayField(formData.experience),
            projects: processArrayField(formData.projects),
            certifications: processArrayField(formData.certifications)
        };

        onSubmit(processedData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 text-white bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl animate-fade-in relative flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-2xl font-semibold text-white">AI Resume Builder</h3>
                <button
                    type="button"
                    onClick={onCancel}
                    className="text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full p-1"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            <p className="text-white/60 text-sm mb-6">Fill in the details below. Our AI will generate an optimized, professional resume tailored for your target role.</p>

            <div className="overflow-y-auto pr-2 space-y-6 flex-grow custom-scrollbar">

                {/* Meta */}
                <div className="space-y-4">
                    <h4 className="text-violet-400 font-semibold border-b border-white/10 pb-2">Document Details</h4>
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-1">Resume Title / File Name <span className="text-rose-500">*</span></label>
                        <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors" placeholder="e.g. Software Engineer 2026" />
                    </div>
                </div>

                {/* Personal Info */}
                <div className="space-y-4">
                    <h4 className="text-violet-400 font-semibold border-b border-white/10 pb-2">Personal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-1">Full Name <span className="text-rose-500">*</span></label>
                            <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-violet-500" placeholder="Jane Doe" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-1">Email <span className="text-rose-500">*</span></label>
                            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-violet-500" placeholder="jane@example.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-1">Phone <span className="text-rose-500">*</span></label>
                            <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-violet-500" placeholder="+1 (555) 123-4567" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-1">LinkedIn (Optional)</label>
                            <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-violet-500" placeholder="linkedin.com/in/janedoe" />
                        </div>
                    </div>
                </div>

                {/* Career Goals */}
                <div className="space-y-4">
                    <h4 className="text-violet-400 font-semibold border-b border-white/10 pb-2">Target & Objective</h4>
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-1">Target Job Role <span className="text-rose-500">*</span></label>
                        <input required type="text" name="targetJobRole" value={formData.targetJobRole} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-violet-500" placeholder="Frontend Developer" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-1">Career Objective (Optional - AI can generate)</label>
                        <textarea name="careerObjective" value={formData.careerObjective} onChange={handleChange} rows={3} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-violet-500" placeholder="A brief summary of your goals..."></textarea>
                    </div>
                </div>

                {/* Experience & Skills (Comma separated for easy input) */}
                <div className="space-y-4">
                    <h4 className="text-violet-400 font-semibold border-b border-white/10 pb-2">Experience & Skills</h4>
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-1">Skills (Comma separated) <span className="text-rose-500">*</span></label>
                        <input required type="text" name="skills" value={formData.skills} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-violet-500" placeholder="React, Node.js, TypeScript, UI/UX" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-1">Experience Highlights (Comma separated)</label>
                        <textarea name="experience" value={formData.experience} onChange={handleChange} rows={3} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-violet-500" placeholder="Worked at TechCorp for 2 years, Increased conversions by 20%, Led frontend team..."></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-1">Key Projects (Comma separated)</label>
                        <textarea name="projects" value={formData.projects} onChange={handleChange} rows={3} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-violet-500" placeholder="E-commerce Dashboard, Personal Portfolio, Chat App..."></textarea>
                    </div>
                </div>

                {/* Education */}
                <div className="space-y-4">
                    <h4 className="text-violet-400 font-semibold border-b border-white/10 pb-2">Education & Certifications</h4>
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-1">Education (Comma separated) <span className="text-rose-500">*</span></label>
                        <input required type="text" name="education" value={formData.education} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-violet-500" placeholder="BS Computer Science Univ of Tech 2024" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-1">Certifications (Optional, comma separated)</label>
                        <input type="text" name="certifications" value={formData.certifications} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-violet-500" placeholder="AWS Certified Developer, Coursera React" />
                    </div>
                </div>
            </div>

            <div className="pt-4 mt-auto border-t border-white/10 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors text-white disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-medium transition-colors text-white shadow-lg shadow-violet-500/20 disabled:opacity-50 flex items-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Generating AI Resume...
                        </>
                    ) : (
                        <>
                            <span className="text-lg">✨</span> Generate Resume
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
