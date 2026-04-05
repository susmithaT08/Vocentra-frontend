import React from 'react';

type ModuleCardProps = {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    metadata: string;
    onClick?: () => void;
};

export default function ModuleCard({ title, description, icon, color, metadata, onClick }: ModuleCardProps) {
    return (
        <div className="glass-card rounded-2xl p-6 module-card border border-white/5 transition-all duration-300">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${color}-500/20 to-${color}-600/20 flex items-center justify-center mb-4`}>
                {icon}
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
            <p className="text-white/50 text-sm mb-4">{description}</p>
            <div className="flex items-center justify-between">
                <span className={`text-${color}-400 text-sm`}>{metadata}</span>
                <button
                    onClick={onClick}
                    className={`px-4 py-2 rounded-lg bg-${color}-500/20 text-${color}-300 text-sm font-medium hover:bg-${color}-500/30 transition-colors`}
                >
                    Start
                </button>
            </div>
        </div>
    );
}
