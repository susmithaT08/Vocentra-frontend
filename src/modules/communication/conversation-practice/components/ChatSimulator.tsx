"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useConversationStore } from '../store/useConversationStore';

export const ChatSimulator: React.FC = () => {
    const { messages, isTyping, sendMessage, endSession } = useConversationStore();
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!inputText.trim() || isTyping) return;
        sendMessage(inputText);
        setInputText('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="w-full bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col h-[600px] overflow-hidden animate-fade-in-up">
            
            <div className="bg-gray-50 border-b border-gray-100 p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg border border-blue-200">
                        🤖
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 leading-tight">AI Simulator</h3>
                        <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online
                        </p>
                    </div>
                </div>
                <button 
                    onClick={endSession}
                    className="text-xs font-bold text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-200 bg-white px-3 py-1.5 rounded-lg transition-colors"
                >
                    End Session
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in`}>
                        <div className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl shadow-sm relative group
                            ${msg.role === 'user' 
                                ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-sm' 
                                : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                            }`}
                        >
                            <div className="flex justify-between items-baseline gap-4 mb-1">
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                                    {msg.role === 'user' ? 'You' : 'AI Partner'}
                                </span>
                                {msg.timestamp && (
                                    <span className={`text-[9px] ${msg.role === 'user' ? 'text-blue-300' : 'text-gray-400'}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                            </div>
                            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="flex justify-start animate-fade-in">
                        <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} className="h-4" />
            </div>

            <div className="bg-white p-4 border-t border-gray-100">
                <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:border-blue-400 focus-within:bg-white transition-colors">
                    <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-blue-500 bg-white rounded-xl shadow-sm border border-gray-100 transition-colors">
                        🎤
                    </button>
                    <input
                        type="text"
                        className="flex-1 bg-transparent border-0 focus:ring-0 text-gray-800 placeholder-gray-400"
                        placeholder="Type your response..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isTyping}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isTyping || !inputText.trim()}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all duration-300
                            ${!inputText.trim() || isTyping ? 'bg-gray-100 text-gray-400' : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-blue-500/20 active:scale-95'}`}
                    >
                        ➔
                    </button>
                </div>
            </div>
        </div>
    );
};
