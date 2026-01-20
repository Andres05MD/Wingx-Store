"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import PremiumButton from "./PremiumButton";

interface HomeBannerProps {
    title: string;
    subtitle: string;
    showResetLink?: boolean;
}

interface Particle {
    xOffset: number;
    duration: number;
    delay: number;
    left: number;
    top: number;
}

export default function HomeBanner({ title, subtitle, showResetLink }: HomeBannerProps) {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const newParticles = Array.from({ length: 12 }).map(() => ({
            xOffset: Math.random() * 20 - 10,
            duration: 4 + Math.random() * 4,
            delay: Math.random() * 3,
            left: Math.random() * 100,
            top: Math.random() * 100,
        }));
        setParticles(newParticles);
    }, []);
    return (
        <section className="relative w-full min-h-[600px] flex items-center justify-center overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-black dark:to-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl">

            {/* Enhanced Animated Background */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                {/* Gradient Orbs */}
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -left-[10%] w-[700px] h-[700px] bg-gradient-to-br from-neutral-300 to-neutral-400 dark:from-neutral-700 dark:to-neutral-600 rounded-full blur-[120px] opacity-40"
                />
                <motion.div
                    animate={{
                        rotate: -360,
                        scale: [1, 1.3, 1],
                        opacity: [0.4, 0.6, 0.4]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[10%] -right-[15%] w-[600px] h-[600px] bg-gradient-to-tl from-slate-300 to-neutral-200 dark:from-slate-800 dark:to-neutral-700 rounded-full blur-[130px] opacity-30"
                />
                <motion.div
                    animate={{
                        x: [-70, 70, -70],
                        y: [-70, 70, -70],
                        scale: [1, 1.15, 1],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-[25%] left-[15%] w-[650px] h-[650px] bg-gradient-to-tr from-gray-200 to-neutral-300 dark:from-gray-800 dark:to-neutral-600 rounded-full blur-[110px] opacity-35"
                />

                {/* Floating Particles */}
                {/* Floating Particles */}
                {particles.map((p, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -30, 0],
                            x: [0, p.xOffset, 0],
                            opacity: [0.2, 0.5, 0.2]
                        }}
                        transition={{
                            duration: p.duration,
                            repeat: Infinity,
                            delay: p.delay,
                            ease: "easeInOut"
                        }}
                        className="absolute w-2 h-2 bg-neutral-400 dark:bg-neutral-600 rounded-full"
                        style={{
                            left: `${p.left}%`,
                            top: `${p.top}%`,
                        }}
                    />
                ))}

                {/* Enhanced Grid Pattern */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] dark:opacity-[0.08]" style={{ backgroundSize: '40px 40px' }}></div>

                {/* Gradient Overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-50/50 dark:to-black/50"></div>

                {/* Noise texture for premium feel */}
                <div className="absolute inset-0 bg-noise opacity-[0.02] dark:opacity-[0.03]"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto backdrop-blur-sm bg-white/30 dark:bg-black/30 p-8 md:p-12 rounded-3xl border border-white/40 dark:border-white/10 shadow-xl ring-1 ring-black/5"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white leading-tight">
                            {title}
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed"
                    >
                        {subtitle}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        {showResetLink ? (
                            <PremiumButton href="/">
                                Ver todos los productos
                            </PremiumButton>
                        ) : (
                            <PremiumButton href="/catalogo">
                                Explorar Catálogo
                            </PremiumButton>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
