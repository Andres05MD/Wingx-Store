"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function InfiniteMarquee({ items: customItems }: { items?: string[] }) {
    const defaultItems = [
        "ENTREGAS SEGURAS",
        "•",
        "CALIDAD PREMIUM GARANTIZADA",
        "•",
        "DISEÑO EXCLUSIVO WINGX",
        "•",
        "NUEVA COLECCIÓN DISPONIBLE",
        "•",
        "COMPRA PROTEGIDA",
        "•"
    ];

    const items = customItems || defaultItems;

    return (
        <div className="w-full bg-neutral-100/90 dark:bg-neutral-900/90 text-neutral-500 dark:text-neutral-400 py-3 overflow-hidden border-y border-neutral-200 dark:border-neutral-800 backdrop-blur-sm">
            <div className="relative flex whitespace-nowrap overflow-hidden">
                <motion.div
                    className="flex gap-8 items-center"
                    animate={{ x: "-50%" }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop"
                    }}
                    style={{ minWidth: "200%" }}
                >
                    {/* Render content twice to create seamless loop */}
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex gap-8 items-center flex-shrink-0">
                            {items.map((item, idx) => (
                                <span key={idx} className="text-sm font-bold tracking-[0.2em] uppercase">
                                    {item}
                                </span>
                            ))}
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
