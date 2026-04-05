import React, { useRef } from 'react';

interface ResumePreviewProps {
    resumeData: unknown; // Using unknown to safely accept the nested or direct MongoDB object
    onEdit: () => void;
    onClose: () => void;
}

export default function ResumePreview({ resumeData, onEdit, onClose }: ResumePreviewProps) {
    const printRef = useRef<HTMLDivElement>(null);

    // Ensure we handle both { data: {...} } and {...} formats seamlessly
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (resumeData as any)?.item || (resumeData as any)?.data || resumeData as any;

    const handleCopy = () => {
        if (data?.resumeText) {
            navigator.clipboard.writeText(data.resumeText);
            alert('Resume copied to clipboard!');
        }
    };

    const handleDownloadPdf = () => {
        if (!printRef.current) return;

        // Simple HTML-to-PDF approach using print styles
        const printWindow = window.open('', '', 'width=800,height=1000');
        if (!printWindow) {
            alert('Please allow popups to generate the PDF.');
            return;
        }

        printWindow.document.write(`
            <html>
                <head>
                    <title>${data?.title || 'Resume'}</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            margin: 0;
                            padding: 40px;
                            background: white;
                        }
                        pre {
                            white-space: pre-wrap;
                            font-family: Arial, sans-serif;
                            font-size: 14px;
                            margin: 0;
                        }
                        @media print {
                            body {
                                padding: 0;
                            }
                        }
                    </style>
                </head>
                <body>
                    <pre>${data?.resumeText || ''}</pre>
                    <script>
                        window.onload = () => {
                            window.print();
                            setTimeout(() => window.close(), 500);
                        };
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl animate-fade-in relative flex flex-col h-[85vh] md:h-[90vh]">

            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-black/20 rounded-t-2xl shrink-0">
                <div>
                    <h3 className="text-2xl font-semibold text-white">Your AI Resume is Ready! ✨</h3>
                    <p className="text-white/60 text-sm mt-1">Generated specifically for your target role.</p>
                </div>

                {/* ATS Score Badge */}
                <div className="flex flex-col items-center bg-violet-900/30 border border-violet-500/30 px-4 py-2 rounded-xl">
                    <span className="text-xs text-violet-300 font-medium uppercase tracking-wider">ATS Score</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-emerald-400">{data?.atsScore || 0}</span>
                        <span className="text-sm text-emerald-500/70">/ 100</span>
                    </div>
                </div>
            </div>

            {/* Document Tools (Edit, Copy, Download) */}
            <div className="flex gap-3 justify-end px-6 py-4 bg-white/5 border-b border-white/5 shrink-0">
                <button
                    onClick={onEdit}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors text-white flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Edit Form
                </button>
                <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors text-white flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    Copy Text
                </button>
                <button
                    onClick={handleDownloadPdf}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-medium transition-colors text-white shadow-lg shadow-violet-500/20 flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download PDF
                </button>
            </div>

            {/* Resume Preview Body (A4 styled Container) */}
            <div className="flex-grow overflow-y-auto p-6 md:p-8 bg-black/80 flex justify-center custom-scrollbar">
                <div
                    ref={printRef}
                    className="bg-white w-full max-w-3xl rounded shadow-2xl p-8 md:p-12 text-black transition-all"
                    style={{ minHeight: '842px' }} // Approximate A4 height
                >
                    <pre className="whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed text-gray-800">
                        {data?.resumeText || 'No resume content generated.'}
                    </pre>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 flex justify-end shrink-0 bg-black/20 rounded-b-2xl">
                <button
                    onClick={onClose}
                    className="px-6 py-2 bg-white/10 hover:bg-rose-500/80 hover:text-white rounded-lg text-sm font-medium transition-colors text-white/80"
                >
                    Close
                </button>
            </div>

        </div>
    );
}
