"use client";

import React from "react";
import { motion } from "framer-motion";
import { Scissors, Palette } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function InfoSections() {
    return (
        <ScrollReveal>
            {/* Bento Grid layout: 12-cols asimétricos en desktop */}
            <section className="grid grid-cols-1 md:grid-cols-12 auto-rows-[minmax(160px,auto)] md:auto-rows-[minmax(200px,auto)] gap-4 md:gap-5 my-8 md:my-20">

                {/* CARD PRINCIPAL (Izquierda) */}
                <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="md:col-span-6 p-6 md:p-12 rounded-[1.5rem] md:rounded-[2rem] relative overflow-hidden group bg-neutral-900 dark:bg-white text-white dark:text-black border border-white/5 dark:border-black/5 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.25)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-white/10 dark:hover:border-black/10 cursor-pointer"
                >
                    <div className="absolute inset-0 bg-noise opacity-[0.02] dark:opacity-[0.04] pointer-events-none" />
                    <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/[0.04] dark:bg-black/[0.04] blur-3xl transition-transform duration-700 group-hover:scale-150" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/[0.03] dark:bg-black/[0.03] blur-3xl" />

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="flex items-center gap-4 md:gap-6 mb-5 md:mb-8">
                                <div className="inline-flex items-center justify-center shrink-0 p-3.5 md:p-4 rounded-2xl bg-white/10 dark:bg-black/10 text-white dark:text-black shadow-sm border border-white/10 dark:border-black/10 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg">
                                    <Scissors size={24} strokeWidth={1.5} className="w-5 h-5 md:w-6 md:h-6" />
                                </div>

                                <h3 className="text-2xl md:text-[2.75rem] font-black text-white dark:text-black font-heading tracking-tight leading-[1.1]">
                                    Confección <br className="hidden md:block" />Propia & Exclusiva
                                </h3>
                            </div>
                            <div className="w-12 h-0.5 bg-gradient-to-r from-white/30 dark:from-black/30 to-transparent mb-4 md:mb-6 rounded-full" />

                            <p className="text-white/60 dark:text-black/60 text-sm md:text-lg leading-relaxed font-light max-w-md">
                                Cada prenda es confeccionada cuidadosamente por nosotros, asegurando la máxima calidad, durabilidad y un acabado único en cada detalle. Diseño 100% original.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* CARD SECUNDARIA (Derecha) */}
                <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="md:col-span-6 p-6 md:p-12 rounded-[1.5rem] md:rounded-[2rem] relative overflow-hidden group bg-neutral-900 dark:bg-white text-white dark:text-black border border-white/5 dark:border-black/5 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.25)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-white/10 dark:hover:border-black/10 cursor-pointer"
                >
                    <div className="absolute inset-0 bg-noise opacity-[0.02] dark:opacity-[0.04] pointer-events-none" />
                    <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-white/[0.04] dark:bg-black/[0.04] blur-3xl transition-transform duration-700 group-hover:scale-150" />

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="flex items-center gap-4 md:gap-6 mb-5 md:mb-8">
                                <div className="inline-flex items-center justify-center shrink-0 p-3.5 md:p-4 rounded-2xl bg-white/10 dark:bg-black/10 text-white dark:text-black shadow-sm border border-white/10 dark:border-black/10 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg">
                                    <Palette size={24} strokeWidth={1.5} className="w-5 h-5 md:w-6 md:h-6" />
                                </div>

                                <h3 className="text-2xl md:text-[2.75rem] font-black text-white dark:text-black font-heading tracking-tight leading-[1.1]">
                                    Pedidos <br className="hidden md:block" />Personalizados
                                </h3>
                            </div>
                            <div className="w-12 h-0.5 bg-gradient-to-r from-white/30 dark:from-black/30 to-transparent mb-4 md:mb-6 rounded-full" />

                            <p className="text-white/60 dark:text-black/60 text-sm md:text-lg leading-relaxed font-light max-w-md">
                                ¿Tienes una idea en mente? Realizamos pedidos personalizados adaptados a tu estilo exacto y medidas específicas.
                            </p>
                        </div>

                        <a
                            href={process.env.NEXT_PUBLIC_WHATSAPP_URL || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-auto group/link inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.15em] text-white dark:text-black hover:opacity-70 transition-opacity"
                        >
                            Saber más
                            <span className="w-5 h-px bg-white dark:bg-black group-hover/link:w-8 transition-all duration-300" />
                        </a>
                    </div>
                </motion.div>

            </section>
        </ScrollReveal>
    );
}
