"use client";

import { motion } from "framer-motion";

interface CatalogHeaderProps {
    title?: string;
    subtitle?: string;
    resultCount?: number;
}

export default function CatalogHeader({
    title = "Catálogo",
    subtitle = "Explora nuestra colección completa de moda exclusiva.",
    resultCount,
}: CatalogHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 md:mb-10"
        >


            {/* Title Section */}
            <div className="flex flex-col gap-3 md:gap-4">
                <div className="flex items-end gap-4 md:gap-6">
                    <h1
                        className="font-heading font-extrabold tracking-tighter leading-none text-black dark:text-white"
                        style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
                    >
                        {title}
                    </h1>
                </div>


            </div>
        </motion.div>
    );
}
