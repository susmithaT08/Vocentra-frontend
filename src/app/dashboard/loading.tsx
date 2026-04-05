export default function Loading() {
    return (
        <div className="w-full h-full min-h-[50vh] flex flex-col items-center justify-center animate-pulse-glow">
            <div className="w-12 h-12 rounded-full border-4 border-violet-500/30 border-t-violet-500 animate-spin mb-4"></div>
            <p className="text-white/50 text-sm font-medium">Loading workspace...</p>
        </div>
    );
}
