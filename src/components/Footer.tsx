"use client";

import React from 'react';
import Link from 'next/link';
import { Instagram, MessageCircle, ArrowRight } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const usefulLinks = [
        { name: 'Inicio', href: '/' },
        { name: 'Catálogo', href: '/catalogo' },
        // { name: 'Nosotros', href: '/nosotros' }, 
    ];

    return (
        <footer className="glass-panel border-t border-black/5 dark:border-white/10 mt-auto z-10 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 md:py-12 md:pb-12">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1 space-y-4">
                        <h3 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-800 to-neutral-500 dark:from-white dark:to-neutral-400">
                                Wingx Store
                            </span>
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md md:max-w-xs leading-relaxed">
                            Moda moderna y exclusiva para quienes buscan destacar. Calidad y estilo en cada prenda.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-neutral-900 dark:text-white tracking-wide text-sm uppercase opacity-90">Enlaces Rápidos</h4>
                        <ul className="space-y-2">
                            {usefulLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="nav-link-animated inline-flex items-center gap-1 text-sm group"
                                    >
                                        <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-neutral-900 dark:text-white tracking-wide text-sm uppercase opacity-90">Contáctanos</h4>
                        <div className="space-y-3">
                            <a
                                href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors group p-1 -ml-1"
                            >
                                <div className="text-pink-600 dark:text-pink-400">
                                    <Instagram className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-medium">Instagram</span>
                            </a>

                            <a
                                href={process.env.NEXT_PUBLIC_WHATSAPP_URL || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors group p-1 -ml-1"
                            >
                                <div className="text-green-600 dark:text-green-400">
                                    <MessageCircle className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-medium">WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 md:mt-12 pt-8 border-t border-black/5 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500 text-center md:text-left">
                    <p>© {currentYear} Wingx Store. Todos los derechos reservados.</p>
                    <div className="flex gap-6">
                        {/* 
            <Link href="/privacidad" className="hover:text-black dark:hover:text-white transition-colors">Privacidad</Link>
            <Link href="/terminos" className="hover:text-black dark:hover:text-white transition-colors">Términos</Link>
            */}
                    </div>
                </div>
            </div>
        </footer>
    );
}
