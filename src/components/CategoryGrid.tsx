"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PiShirtFoldedBold, PiPantsBold, PiCoatHangerBold, PiSunglassesBold } from "react-icons/pi";
import ScrollReveal from "./ScrollReveal";

// You can expand this list or fetch it dynamically later
const CATEGORIES = [
    {
        id: "camisas",
        name: "Camisas",
        href: "/catalogo?search=Camisa",
        icon: <PiShirtFoldedBold className="w-8 h-8 text-black dark:text-white" />
    },
    {
        id: "pantalones",
        name: "Pantalones",
        href: "/catalogo?search=Pantalón",
        icon: <PiPantsBold className="w-8 h-8 text-black dark:text-white" />
    },
    {
        id: "conjuntos",
        name: "Conjuntos",
        href: "/catalogo?search=Conjunto",
        icon: <PiCoatHangerBold className="w-8 h-8 text-black dark:text-white" />
    },
    {
        id: "trajes-bano",
        name: "Trajes de baño",
        href: "/catalogo?search=Traje de baño",
        icon: <PiSunglassesBold className="w-8 h-8 text-black dark:text-white" />
    },
];

export default function CategoryGrid() {
    return (
        <section className="my-12">
            <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-2">
                <span className="w-1 h-8 rounded-full bg-black dark:bg-white inline-block"></span>
                Explora por Categoría
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CATEGORIES.map((category, index) => (
                    <ScrollReveal key={category.id} delay={index * 0.1}>
                        <Link href={category.href} className="group block h-full">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="relative h-40 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-black border-2 border-black dark:border-white p-6 flex flex-col justify-end items-start"
                            >
                                <div className="absolute top-4 right-4 opacity-50 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-300 transform">
                                    {category.icon}
                                </div>

                                <div className="relative z-10 w-full">
                                    <h3 className="text-black dark:text-white text-xl font-bold tracking-wide group-hover:translate-x-1 transition-transform">
                                        {category.name}
                                    </h3>
                                    <div className="h-1 w-8 bg-black/50 dark:bg-white/50 rounded-full mt-2 group-hover:w-16 transition-all duration-300" />
                                </div>

                                {/* Decorative bubbles - Subtle contrast */}
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-black/5 dark:bg-white/5 rounded-full blur-2xl" />
                                <div className="absolute -bottom-8 -left-4 w-32 h-32 bg-black/5 dark:bg-white/5 rounded-full blur-xl" />
                            </motion.div>
                        </Link>
                    </ScrollReveal>
                ))}
            </div>
        </section>
    );
}
