'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-red-500/10 border border-red-500/20 rounded-2xl m-4">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-white mb-2">Something went wrong!</h2>
            <p className="text-white/60 text-sm mb-6 text-center max-w-md">We encountered an unexpected error loading this module.</p>
            <button
                className="px-6 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors font-medium border border-red-500/50"
                onClick={() => reset()}
            >
                Try again
            </button>
        </div>
    )
}
