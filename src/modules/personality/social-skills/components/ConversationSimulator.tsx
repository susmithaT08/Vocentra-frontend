"use client";

import React, { useRef, useEffect } from 'react';
import { useSocialStore } from '../store/useSocialStore';

export const ConversationSimulator: React.FC = () => {
    const { 
        activeScenario, 
        chatHistory, 
        currentUserInput, 
        setUserInput, 
        sendMessage, 
        isLoading,
        error
    } = useSocialStore();

    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Auto scroll chat to bottom when new messages arrive
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory, isLoading]);

    if (!activeScenario) return null;

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 mt-6 overflow-hidden flex flex-col h-[500px] animate-fade-in-up">
            <div className="bg-indigo-50 border-b border-indigo-100 p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{activeScenario === 'Networking' ? '🤝' : activeScenario === 'Small Talk' ? '☕' : '💼'}</span>
                    <div>
                        <h3 className="font-bold text-indigo-900">{activeScenario} Simulator</h3>
                        <p className="text-xs text-indigo-600">AI Partner Active</p>
                    </div>
                </div>
            </div>

            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50/50">
                {chatHistory.length === 0 && (
                    <div className="text-center text-sm text-gray-400 mt-10">
                        Start the conversation by sending an opening message.
                    </div>
                )}
                {chatHistory.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                            msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                        }`}>
                            <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-2xl p-4 bg-white border border-gray-100 shadow-sm rounded-tl-sm flex gap-2 items-center">
                            <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></span>
                            <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-75"></span>
                            <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-150"></span>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
                {error && (
                    <div className="mb-3 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
                        ⚠ {error}
                    </div>
                )}
                <div className="flex gap-3">
                    <input 
                        type="text"
                        className="flex-1 p-3 md:p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 disabled:opacity-50 text-gray-800"
                        placeholder="Type your response..."
                        value={currentUserInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !isLoading) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        disabled={isLoading}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={isLoading || currentUserInput.trim().length === 0}
                        className={`px-6 py-3 md:py-4 rounded-xl font-bold transition-all flex items-center justify-center min-w-[100px]
                            ${(isLoading || currentUserInput.trim().length === 0)
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow focus:ring-4 focus:ring-indigo-100'
                            }`}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};
