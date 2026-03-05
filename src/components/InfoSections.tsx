"use client";

import React from "react";
import { motion } from "framer-motion";
import { Scissors, Palette, Sparkles } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function InfoSections() {
    return (
        <ScrollReveal>
            {/* Bento Grid layout: 12-cols asimétricos en desktop */}
            <section className="grid grid-cols-1 md:grid-cols-12 auto-rows-[minmax(160px,auto)] md:auto-rows-[minmax(200px,auto)] gap-4 md:gap-5 my-8 md:my-20">

                {/* CARD PRINCIPAL (Izquierda) — ocupa 7 columnas y 2 filas */}
                <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="md:col-span-7 md:row-span-2 p-6 md:p-12 rounded-[1.5rem] md:rounded-[2rem] relative overflow-hidden group bg-neutral-900 dark:bg-white text-white dark:text-black border border-white/5 dark:border-black/5 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.25)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-white/10 dark:hover:border-black/10 cursor-pointer"
                >
                    {/* Textura y efectos de fondo */}
                    <div className="absolute inset-0 bg-noise opacity-[0.02] dark:opacity-[0.04] pointer-events-none" />
                    <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/[0.04] dark:bg-black/[0.04] blur-3xl transition-transform duration-700 group-hover:scale-150" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/[0.03] dark:bg-black/[0.03] blur-3xl" />

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            {/* Icono con background premium */}
                            <div className="inline-flex items-center justify-center p-3.5 md:p-4 mb-5 md:mb-8 rounded-2xl bg-white/10 dark:bg-black/10 text-white dark:text-black shadow-sm border border-white/10 dark:border-black/10 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg">
                                <Scissors size={24} strokeWidth={1.5} className="w-5 h-5 md:w-6 md:h-6" />
                            </div>

                            <h3 className="text-2xl md:text-[2.75rem] font-black text-white dark:text-black font-heading tracking-tight leading-[1.1] mb-3 md:mb-5">
                                Confección <br className="hidden md:block" />Propia & Exclusiva
                            </h3>
                            <div className="w-12 h-0.5 bg-gradient-to-r from-white/30 dark:from-black/30 to-transparent mb-4 md:mb-6 rounded-full" />

                            <p className="text-white/60 dark:text-black/60 text-sm md:text-lg leading-relaxed font-light max-w-md">
                                Cada prenda es confeccionada cuidadosamente por nosotros, asegurando la máxima calidad, durabilidad y un acabado único en cada detalle. Diseño 100% original.
                            </p>
                        </div>


                    </div>
                </motion.div>

                {/* CARD SECUNDARIA (Derecha Top) */}
                <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="md:col-span-5 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] relative overflow-hidden group bg-neutral-900 dark:bg-white text-white dark:text-black border border-white/5 dark:border-black/5 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.25)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-white/10 dark:hover:border-black/10 cursor-pointer"
                >
                    <div className="absolute inset-0 bg-noise opacity-[0.015] pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-white/[0.03] dark:bg-black/[0.03] blur-3xl transition-transform duration-700 group-hover:scale-150" />

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4 md:mb-6">
                            <div className="p-3 inline-flex bg-white/10 dark:bg-black/10 rounded-xl text-white dark:text-black transition-all duration-500 group-hover:scale-110 group-hover:shadow-md">
                                <Palette size={20} className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.5} />
                            </div>
                        </div>

                        <h3 className="text-lg md:text-2xl font-black text-white dark:text-black font-heading tracking-tight mb-2 md:mb-3 leading-tight">
                            Pedidos Personalizados
                        </h3>
                        <p className="text-white/60 dark:text-black/60 text-sm leading-relaxed font-light mb-6">
                            ¿Tienes una idea en mente? Realizamos pedidos personalizados adaptados a tu estilo exacto y medidas específicas.
                        </p>

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

                {/* CARD INVERTIDA (Derecha Bottom) — fondo negro */}
                <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="md:col-span-5 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] relative overflow-hidden group bg-black text-white dark:bg-white dark:text-black border border-transparent transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.25)] dark:hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.15)] cursor-pointer"
                >
                    {/* Textura noise */}
                    <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none mix-blend-soft-light" />
                    {/* Orbe interior */}
                    <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-white/[0.04] dark:bg-black/[0.04] blur-3xl transition-transform duration-700 group-hover:scale-150" />

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="p-3 inline-flex bg-white/10 dark:bg-black/10 rounded-xl mb-4 md:mb-6 transition-transform duration-500 group-hover:scale-110">
                                <Sparkles size={20} className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.5} />
                            </div>

                            <h3 className="text-xl md:text-3xl font-black font-heading tracking-tight leading-tight mb-2 md:mb-3">
                                Urban<br />Luxury
                            </h3>
                            <p className="text-white/60 dark:text-black/60 text-sm font-light leading-relaxed">
                                Diseño premium que fusiona el estilo urbano con acabados de alta costura.
                            </p>
                        </div>


                    </div>
                </motion.div>

            </section>
        </ScrollReveal>
    );
}
