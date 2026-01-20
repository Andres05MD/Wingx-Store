"use client";

import { motion } from "framer-motion";

interface CatalogHeaderProps {
    title?: string;
    subtitle?: string;
}

export default function CatalogHeader({
    title = "Catálogo Completo",
    subtitle = "Explora nuestra colección completa de moda exclusiva."
}: CatalogHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="glass-panel rounded-3xl p-6 mb-6 md:p-8 md:mb-8 text-center border border-black/5 dark:border-white/5 bg-white/90 dark:bg-black/90 shadow-sm relative overflow-hidden"
        >
            <div className="relative z-10">
                <h1 className="text-2xl md:text-5xl font-bold tracking-tight mb-2 md:mb-4 bg-gradient-to-r from-black to-neutral-700 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent">
                    {title}
                </h1>
                <p className="text-sm md:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
                    {subtitle}
                </p>
            </div>
        </motion.div>
    );
}
