"use client";

import React from "react";
import { motion } from "framer-motion";
import PremiumButton from "./PremiumButton";

interface HomeBannerProps {
    title: string;
    subtitle: string;
    showResetLink?: boolean;
}

export default function HomeBanner({ title, subtitle, showResetLink }: HomeBannerProps) {

    return (
        <section className="relative w-full min-h-[420px] sm:min-h-[520px] md:min-h-[85vh] flex items-center justify-center overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] md:rounded-[3rem] bg-neutral-50 dark:bg-neutral-950 border border-black/5 dark:border-white/5">

            {/* Fondo con textura de ruido + gradiente radial */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                {/* Gradiente radial central */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.03)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)]" />

                {/* Textura de ruido sutil */}
                <div className="absolute inset-0 bg-noise opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay" />

                {/* Orbe flotante 1 — grande, esquina superior izquierda */}
                <div
                    className="absolute -top-20 -left-20 w-64 h-64 md:w-[500px] md:h-[500px] rounded-full bg-black/[0.04] dark:bg-white/[0.04] blur-3xl animate-float-slow"
                />

                {/* Orbe flotante 2 — mediano, esquina inferior derecha */}
                <div
                    className="absolute -bottom-16 -right-16 w-48 h-48 md:w-[400px] md:h-[400px] rounded-full bg-black/[0.06] dark:bg-white/[0.06] blur-[100px] animate-float-medium"
                />

                {/* Orbe flotante 3 — pequeño, centro-derecha */}
                <div
                    className="absolute top-1/3 right-1/4 w-32 h-32 md:w-64 md:h-64 rounded-full bg-black/[0.03] dark:bg-white/[0.03] blur-3xl animate-float-fast"
                />

                {/* Líneas decorativas geométricas con esquinas */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-8 left-8 md:left-12 w-px h-24 md:h-40 bg-gradient-to-b from-black/10 to-transparent dark:from-white/10" />
                    <div className="absolute top-8 left-8 md:left-12 h-px w-16 md:w-28 bg-gradient-to-r from-black/10 to-transparent dark:from-white/10" />
                    <div className="absolute bottom-8 right-8 md:right-12 w-px h-24 md:h-40 bg-gradient-to-t from-black/10 to-transparent dark:from-white/10" />
                    <div className="absolute bottom-8 right-8 md:right-12 h-px w-16 md:w-28 bg-gradient-to-l from-black/10 to-transparent dark:from-white/10" />
                </div>

                {/* Grid de puntos sutil */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.04)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.03)_1px,transparent_0)] [background-size:32px_32px] opacity-50" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto p-2 sm:p-4 md:p-12 relative z-20"
                >


                    {/* Título con efecto shine + más dramático */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.25, duration: 0.6 }}
                    >
                        <h1 className="text-[2.5rem] sm:text-6xl md:text-[7rem] lg:text-[8.5rem] font-black tracking-[-0.04em] mb-3 md:mb-4 text-black dark:text-white leading-[0.9] font-heading hero-title-shine">
                            {title}
                        </h1>

                        {/* Línea decorativa debajo del título */}
                        <div className="flex justify-center mb-6 md:mb-8">
                            <span className="hero-accent-line" />
                        </div>
                    </motion.div>

                    {/* Subtítulo */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.45, duration: 0.6 }}
                        className="text-base md:text-xl text-neutral-500 dark:text-neutral-400 mx-auto max-w-lg leading-relaxed font-light font-sans tracking-wide"
                    >
                        {subtitle}
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65, duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mt-8 sm:mt-12 md:mt-16"
                    >
                        {showResetLink ? (
                            <PremiumButton href="/" variant="solid">
                                Ver todos los productos
                            </PremiumButton>
                        ) : (
                            <>
                                <PremiumButton href="/catalogo" variant="solid">
                                    Explorar Catálogo
                                </PremiumButton>
                                <PremiumButton href="/catalogo?category=Personalizado" variant="outline">
                                    Pedidos Personalizados
                                </PremiumButton>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
