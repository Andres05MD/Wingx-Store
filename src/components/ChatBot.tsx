"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, Minimize2, Sparkles, ShoppingCart, Package, Ruler, Truck, CreditCard, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

const chatSchema = z.object({
    message: z.string().min(1, 'Escribe un mensaje'),
});

type ChatFormValues = z.infer<typeof chatSchema>;

const FormattedMessage = ({ content }: { content: string }) => {
    const lines = content.split('\n');

    return (
        <div className="space-y-1">
            {lines.map((line, i) => {
                if (!line.trim()) return <div key={i} className="h-2" />;

                const parts = line.split(/(\*\*.*?\*\*)/g);
                const formattedLine = parts.map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                });

                const isList = line.trim().startsWith('- ') || line.trim().startsWith('• ');

                if (isList) {
                    const cleanLineContent = line.replace(/^(\s*[-•]\s*)/, '');
                    const listParts = cleanLineContent.split(/(\*\*.*?\*\*)/g).map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>;
                        }
                        return part;
                    });

                    return (
                        <div key={i} className="flex gap-2 ml-1 items-start">
                            <span className="mt-[7px] w-1 h-1 rounded-full bg-current flex-shrink-0 opacity-40" />
                            <div className="flex-1">{listParts}</div>
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
        defaultValues: { message: '' }
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

    const sugerencias = [
        { icono: ShoppingCart, label: "Cómo comprar", texto: "¿Cómo puedo realizar una compra?" },
        { icono: Package, label: "Envíos", texto: "¿Hacen envíos a toda Venezuela?" },
        { icono: Ruler, label: "A medida", texto: "¿Cómo funcionan los pedidos hechos a la medida?" },
        { icono: Truck, label: "Delivery", texto: "¿Tienen servicio de delivery en Barquisimeto?" },
        { icono: CreditCard, label: "Pagos", texto: "¿Qué métodos de pago aceptan?" },
        { icono: MapPin, label: "Ubicación", texto: "¿Dónde están ubicados?" }
    ];

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] bg-white dark:bg-neutral-950 rounded-2xl shadow-[0_25px_60px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.5)] border border-neutral-200/80 dark:border-neutral-800 flex flex-col overflow-hidden h-[560px] max-h-[70vh]"
                    >
                        {/* Header */}
                        <div className="px-5 py-4 bg-neutral-950 dark:bg-white text-white dark:text-black flex items-center justify-between relative overflow-hidden">
                            <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
                            <div className="relative flex items-center gap-3">
                                <div className="w-8 h-8 bg-white/10 dark:bg-black/10 rounded-lg flex items-center justify-center">
                                    <Sparkles size={15} strokeWidth={2} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm tracking-tight leading-none">Merlia</h3>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                                        <span className="text-[10px] font-medium opacity-50 tracking-wide">En línea</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="relative p-1.5 hover:bg-white/10 dark:hover:bg-black/10 rounded-lg transition-colors"
                                aria-label="Minimizar chat"
                            >
                                <Minimize2 size={16} strokeWidth={2} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div
                            className="flex-1 overflow-y-auto overscroll-y-contain p-4 space-y-3 bg-neutral-50/50 dark:bg-neutral-950 scroll-smooth"
                            data-lenis-prevent
                        >
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center px-4 py-6">
                                    {/* Welcome */}
                                    <div className="w-11 h-11 bg-neutral-900 dark:bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
                                        <Sparkles size={18} className="text-white dark:text-black" strokeWidth={2} />
                                    </div>
                                    <p className="font-bold text-sm text-neutral-900 dark:text-white tracking-tight">
                                        ¡Hola! Soy Merlia
                                    </p>
                                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 max-w-[220px] leading-relaxed">
                                        Asistente virtual de Wingx. ¿En qué puedo ayudarte?
                                    </p>

                                    {/* Sugerencias */}
                                    <div className="grid grid-cols-2 gap-2 mt-6 w-full max-w-[300px]">
                                        {sugerencias.map((s, idx) => {
                                            const Icono = s.icono;
                                            return (
                                                <motion.button
                                                    key={idx}
                                                    onClick={() => handleSuggestionClick(s.texto)}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    className="flex items-center gap-2 text-left text-[11px] font-medium px-3 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                                                >
                                                    <Icono size={13} strokeWidth={2} className="flex-shrink-0 opacity-50" />
                                                    <span>{s.label}</span>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[82%] px-4 py-3 text-[13px] leading-relaxed ${msg.role === 'user'
                                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-black rounded-2xl rounded-br-md shadow-sm'
                                            : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-100 dark:border-neutral-800 rounded-2xl rounded-bl-md shadow-sm'
                                            }`}
                                    >
                                        <FormattedMessage content={msg.content} />
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && messages[messages.length - 1]?.role === 'user' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-white dark:bg-neutral-900 px-4 py-3 rounded-2xl rounded-bl-md border border-neutral-100 dark:border-neutral-800 shadow-sm flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600 animate-bounce [animation-delay:0ms]" />
                                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600 animate-bounce [animation-delay:150ms]" />
                                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600 animate-bounce [animation-delay:300ms]" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit(onSubmit)} className="p-3 bg-white dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-800/50">
                            <div className="flex gap-2 items-center relative">
                                <input
                                    type="text"
                                    {...register('message')}
                                    placeholder="Escribe tu mensaje..."
                                    className="flex-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl pl-4 pr-12 py-3 text-[13px] focus:ring-2 focus:ring-neutral-900/5 dark:focus:ring-white/10 focus:outline-none focus:border-neutral-300 dark:focus:border-neutral-700 transition-all placeholder:text-neutral-300 dark:placeholder:text-neutral-600 font-medium"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !isValid}
                                    className="absolute right-1.5 p-2.5 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-lg hover:bg-black dark:hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    aria-label="Enviar mensaje"
                                >
                                    <Send size={14} strokeWidth={2.5} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        onClick={() => setIsOpen(true)}
                        className="hidden md:flex fixed bottom-6 right-6 z-50 items-center justify-center w-13 h-13 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-2xl shadow-[0_8px_30px_-5px_rgba(0,0,0,0.3)] dark:shadow-[0_8px_30px_-5px_rgba(255,255,255,0.15)] hover:shadow-[0_12px_40px_-5px_rgba(0,0,0,0.35)] transition-shadow border border-white/10 dark:border-black/10"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Abrir chat"
                    >
                        <Sparkles size={22} strokeWidth={2} />
                    </motion.button>
                )}
            </AnimatePresence>
        </>
    );
}
