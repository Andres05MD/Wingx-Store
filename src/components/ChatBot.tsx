"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Minimize2, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

// Zod Schema
const chatSchema = z.object({
    message: z.string().min(1, 'Escribe un mensaje'),
});

type ChatFormValues = z.infer<typeof chatSchema>;

const FormattedMessage = ({ content }: { content: string }) => {
    // Split by newlines
    const lines = content.split('\n');

    return (
        <div className="space-y-1">
            {lines.map((line, i) => {
                if (!line.trim()) return <div key={i} className="h-2" />; // Spacer for empty lines

                // Parse bold text: **text**
                const parts = line.split(/(\*\*.*?\*\*)/g);
                const formattedLine = parts.map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                });

                // Check for list items
                const isList = line.trim().startsWith('- ') || line.trim().startsWith('• ');

                if (isList) {
                    // Strip the bullet for cleaner rendering
                    const cleanLineContent = line.replace(/^(\s*[-•]\s*)/, '');
                    // Re-parse the clean content for bold
                    const listParts = cleanLineContent.split(/(\*\*.*?\*\*)/g).map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>;
                        }
                        return part;
                    });

                    return (
                        <div key={i} className="flex gap-2 ml-1 items-start">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-current flex-shrink-0 opacity-60" />
                            <div className="flex-1">
                                {listParts}
                            </div>
                        </div>
                    );
                }

                return <p key={i} className="min-h-[1.2em]">{formattedLine}</p>;
            })}
        </div>
    );
};

import { useChat } from "@/context/ChatContext";

export default function ChatBot() {
    const { isChatOpen: isOpen, setIsChatOpen: setIsOpen } = useChat();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { isValid }
    } = useForm<ChatFormValues>({
        resolver: zodResolver(chatSchema),
        defaultValues: {
            message: ''
        }
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const onSubmit = async (data: ChatFormValues) => {
        if (isLoading) return;

        const userMessage: Message = { role: 'user', content: data.message };
        setMessages(prev => [...prev, userMessage]);
        reset();
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMessage] })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = "";

            setMessages(prev => [...prev, { role: 'assistant', content: "" }]);

            while (true) {
                const { done, value } = await reader!.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                assistantMessage += chunk;

                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].content = assistantMessage;
                    return newMessages;
                });
            }

        } catch (error) {
            console.error("Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Lo siento, tuve un problema al procesar tu mensaje. Por favor intenta de nuevo." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (text: string) => {
        setValue('message', text, { shouldValidate: true });
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-[380px] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden h-[600px] max-h-[70vh]"
                    >
                        {/* Header */}
                        <div className="p-4 bg-black dark:bg-white text-white dark:text-black flex items-center justify-between shadow-sm z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-white/20 dark:bg-black/10 rounded-full">
                                    <Bot size={18} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm leading-tight">Merlia</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[10px] opacity-80">En línea</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/10 dark:hover:bg-black/10 rounded-full transition-colors"
                            >
                                <Minimize2 size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div
                            className="flex-1 overflow-y-auto overscroll-y-contain p-4 space-y-4 bg-neutral-50 dark:bg-neutral-950 scroll-smooth"
                            data-lenis-prevent
                        >
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 p-8 space-y-4">
                                    <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mb-2">
                                        <Bot size={24} className="opacity-50" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-neutral-800 dark:text-neutral-200">¡Hola! Soy Merlia, el asistente virtual de Wingx.</p>
                                        <p className="text-sm mt-1">¿En qué puedo ayudarte hoy?</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 justify-center mt-4 max-w-[280px]">
                                        {[
                                            { label: "🛒 Cómo Comprar?", text: "¿Cómo puedo realizar una compra?" },
                                            { label: "📦 Envíos Nacionales", text: "¿Hacen envíos a toda Venezuela?" },
                                            { label: "📏 Pedidos a Medida", text: "¿Cómo funcionan los pedidos hechos a la medida?" },
                                            { label: "🛵 Delivery BQTO", text: "¿Tienen servicio de delivery en Barquisimeto?" },
                                            { label: "💳 Métodos de Pago", text: "¿Qué métodos de pago aceptan?" },
                                            { label: "📍 Ubicación", text: "¿Dónde están ubicados?" }
                                        ].map((suggestion, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSuggestionClick(suggestion.text)}
                                                className="text-xs px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all hover:scale-105 active:scale-95 shadow-sm"
                                            >
                                                {suggestion.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                                >
                                    <div
                                        className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-black dark:bg-white text-white dark:text-black rounded-tr-none shadow-md'
                                            : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 rounded-tl-none shadow-sm'
                                            }`}
                                    >
                                        <FormattedMessage content={msg.content} />
                                    </div>
                                </div>
                            ))}
                            {isLoading && messages[messages.length - 1]?.role === 'user' && (
                                <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                                    <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl rounded-tl-none border border-neutral-200 dark:border-neutral-700 shadow-sm flex items-center gap-2">
                                        <Loader2 size={14} className="animate-spin text-neutral-400" />
                                        <span className="text-xs text-neutral-400">Pensando...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit(onSubmit)} className="p-3 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
                            <div className="flex gap-2 items-center relative">
                                <input
                                    type="text"
                                    {...register('message')}
                                    placeholder="Escribe tu mensaje..."
                                    className="flex-1 bg-neutral-100 dark:bg-neutral-800 border-none rounded-2xl pl-4 pr-12 py-3 text-sm focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:outline-none transition-all placeholder:text-neutral-400"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !isValid}
                                    className="absolute right-1.5 p-2 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button - Hidden when chat is open */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        onClick={() => setIsOpen(true)}
                        className="hidden md:flex fixed bottom-6 right-6 z-50 items-center justify-center w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-shadow border-2 border-white dark:border-black"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <MessageCircle size={28} />
                    </motion.button>
                )}
            </AnimatePresence>
        </>
    );
}
