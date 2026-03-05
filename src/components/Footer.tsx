"use client";

import React from 'react';
import Link from 'next/link';
import { Instagram, MessageCircle, ArrowUpRight } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const usefulLinks = [
        { name: 'Inicio', href: '/' },
        { name: 'Catálogo', href: '/catalogo' },
    ];

    return (
        <footer className="relative mt-4 md:mt-8 z-10 w-full overflow-hidden bg-white/70 dark:bg-black/50 backdrop-blur-3xl border-t border-black/[0.04] dark:border-white/[0.06] shadow-[0_-8px_40px_rgba(0,0,0,0.02)] transition-colors duration-500 pb-20 md:pb-0">
            {/* Textura de ruido sutil */}
            <div className="absolute inset-0 bg-noise opacity-[0.015] dark:opacity-[0.03] pointer-events-none mix-blend-overlay" />

            {/* Orbes decorativos integrados */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-black/[0.02] dark:bg-white/[0.02] blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-black/[0.03] dark:bg-white/[0.03] blur-3xl" />
            </div>

            <div className="relative z-10 max-w-[1800px] mx-auto px-5 sm:px-8 lg:px-12 pt-10 pb-6 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-8">

                    {/* Brand Column */}
                    <div className="md:col-span-5 space-y-5">
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl md:text-2xl font-black tracking-tighter text-black dark:text-white font-heading">
                                Wingx Store
                            </h3>
                            <div className="h-px w-8 bg-gradient-to-r from-black/20 to-transparent dark:from-white/20" />
                        </div>
                        <p className="text-[13px] md:text-sm text-neutral-500 dark:text-neutral-400 max-w-sm leading-relaxed font-light">
                            Diseño exclusivo y confección de alta calidad. Moda urbana moderna para quienes buscan destacar con estilo propio.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-3 md:col-start-7 space-y-4 md:space-y-6">
                        <h4 className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 tracking-[0.2em] uppercase">
                            Navegación
                        </h4>
                        <ul className="flex flex-row md:flex-col gap-4 md:space-y-3 md:gap-0">
                            {usefulLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="inline-flex items-center gap-2 md:gap-3 text-[13px] md:text-sm text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-all duration-300 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-black/20 dark:bg-white/20 group-hover:bg-black dark:group-hover:bg-white transition-colors duration-300" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div className="md:col-span-3 space-y-4 md:space-y-6 flex flex-col items-start pt-2 md:pt-0">
                        <h4 className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 tracking-[0.2em] uppercase">
                            Síguenos
                        </h4>
                        <div className="flex flex-col gap-2.5 md:gap-3 w-full sm:max-w-xs">
                            <a
                                href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between px-4 py-2.5 md:py-3 rounded-[1rem] md:rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.03] dark:border-white/[0.03] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:border-transparent transition-all duration-300 group cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <Instagram className="w-4 h-4" />
                                    <span className="text-[13px] md:text-sm font-medium">Instagram</span>
                                </div>
                                <ArrowUpRight className="w-3 h-3 md:w-3.5 md:h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                            </a>

                            <a
                                href={process.env.NEXT_PUBLIC_WHATSAPP_URL || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between px-4 py-2.5 md:py-3 rounded-[1rem] md:rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.03] dark:border-white/[0.03] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:border-transparent transition-all duration-300 group cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <MessageCircle className="w-4 h-4" />
                                    <span className="text-[13px] md:text-sm font-medium">WhatsApp</span>
                                </div>
                                <ArrowUpRight className="w-3 h-3 md:w-3.5 md:h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-10 md:mt-12 pt-6 border-t border-black/[0.04] dark:border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-[10px] md:text-[11px] text-neutral-400 dark:text-neutral-500">
                    <p className="tracking-wide">© {currentYear} Wingx Store. Reservados todos los derechos.</p>
                    <div className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                        <span>CEO: Valeria Petaccia</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
