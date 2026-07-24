"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { getCategorias, type Categoria } from '@/services/categoryService';

interface CategoryWithIcon {
    id: string;
    name: string;
    href: string;
    icon: React.ReactNode;
}

const iconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
    Shirt: LucideIcons.Shirt,
    ShirtIcon: LucideIcons.Shirt,
    Layers: LucideIcons.Layers,
    Sun: LucideIcons.Sun,
    Wind: LucideIcons.Wind,
    Umbrella: LucideIcons.Umbrella,
    Watch: LucideIcons.Watch,
    BaggageClaim: LucideIcons.BaggageClaim,
    Shoe: LucideIcons.Footprints,
    Gem: LucideIcons.Gem,
    Sparkles: LucideIcons.Sparkles,
    Heart: LucideIcons.Heart,
    Star: LucideIcons.Star,
    Zap: LucideIcons.Zap,
    Flame: LucideIcons.Flame,
    Droplets: LucideIcons.Droplets,
    Package: LucideIcons.Package,
    Backpack: LucideIcons.Backpack,
    Tag: LucideIcons.Tag,
    Snowflake: LucideIcons.Snowflake,
};

export default function CategoryGrid() {
    const [categories, setCategories] = useState<CategoryWithIcon[]>([]);

    useEffect(() => {
        getCategorias().then((data: Categoria[]) => {
            const withIcons = data
                .filter(cat => cat.icon)
                .map(cat => {
                    const IconComp = iconMap[cat.icon!] || LucideIcons.Tag;
                    return {
                        id: cat.name.toLowerCase().replace(/\s+/g, '-'),
                        name: cat.name,
                        href: `/catalogo?search=${encodeURIComponent(cat.name)}`,
                        icon: <IconComp className="w-8 h-8 text-black dark:text-white" strokeWidth={1.5} />,
                    };
                });
            setCategories(withIcons);
        }).catch(console.error);
    }, []);

    if (categories.length === 0) return null;

    return (
        <section className="my-12">
            <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-2">
                <span className="w-1 h-8 rounded-full bg-black dark:bg-white inline-block"></span>
                Explora por Categoría
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((category, index) => (
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
