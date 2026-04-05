'use client';

import { useState, useRef, useEffect } from 'react';

interface SpeakingRecorderProps {
    onComplete: (audioBlob: Blob, durationSeconds: number) => void;
}

export default function SpeakingRecorder({ onComplete }: SpeakingRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [timer, setTimer] = useState(0);
    const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<BlobPart[]>([]);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
                mediaRecorderRef.current.stop();
            }
        };
    }, []);

    const startRecording = async () => {
        setError(null);
        setTimer(0);
        audioChunksRef.current = [];

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setPermissionGranted(true);

            let options = { mimeType: 'audio/webm' };
            if (!MediaRecorder.isTypeSupported('audio/webm')) {
                options = { mimeType: 'audio/mp4' };
            }

            const mediaRecorder = new MediaRecorder(stream, options);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
                onComplete(audioBlob, timer);
                stream.getTracks().forEach(t => t.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);

            timerIntervalRef.current = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);

        } catch (err) {
            console.error(err);
            setPermissionGranted(false);
            setError('Microphone access is required to use this feature.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    if (error) {
        return (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {error}
                {permissionGranted === false && (
                    <button onClick={startRecording} className="ml-2 font-semibold underline">Try Again</button>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            <div className={`relative flex items-center justify-center w-32 h-32 rounded-full mb-6 ${isRecording ? 'bg-rose-500/20' : 'bg-emerald-500/20'}`}>
                {/* Pulse ring when recording */}
                {isRecording && (
                    <div className="absolute inset-0 rounded-full border-4 border-rose-500/50 animate-ping"></div>
                )}

                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 ${isRecording
                        ? 'bg-rose-600 hover:bg-rose-500 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                >
                    {isRecording ? (
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z" /></svg> // Stop Icon
                    ) : (
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg> // Mic Icon
                    )}
                </button>
            </div>

            <div className="font-mono text-xl text-white font-medium tracking-wider mb-6">
                {formatTime(timer)}
            </div>

            <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-xl p-4 min-h-[40px] relative text-center">
                <p className="text-white/50 text-sm">
                    {isRecording ? "Listening to your speech..." : "Press the microphone to capture audio."}
                </p>
            </div>
        </div>
    );
}
