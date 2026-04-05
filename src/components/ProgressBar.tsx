export default function ProgressBar({ progress, color }: { progress: number, color: string }) {
    return (
        <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
                className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-400 rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
