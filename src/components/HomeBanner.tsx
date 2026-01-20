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
        <section className="relative w-full min-h-[400px] md:min-h-[600px] flex items-center justify-center overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 shadow-xl">

            {/* Enhanced Animated Background */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">

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




            </div>

            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto p-4 md:p-12 relative z-20"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >

                        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-4 md:mb-6 text-slate-900 dark:text-white leading-tight">
                            {title}
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-base md:text-xl text-slate-600 dark:text-slate-300 mb-6 md:mb-10 max-w-2xl mx-auto leading-relaxed"
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
