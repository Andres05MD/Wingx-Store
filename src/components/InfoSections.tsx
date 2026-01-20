"use client";

import React from "react";
import { motion } from "framer-motion";
import { Scissors, Palette } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function InfoSections() {
    return (
        <ScrollReveal>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shrink-0">
                            <Scissors size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Confección Propia</h3>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Cada prenda es confeccionada cuidadosamente por nosotros, asegurando la máxima calidad, durabilidad y un acabado único en cada detalle.
                    </p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shrink-0">
                            <Palette size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Pedidos Personalizados</h3>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        ¿Tienes una idea en mente? Realizamos pedidos personalizados adaptados a tu estilo y medidas. Contáctanos para crear algo especial para ti.
                    </p>
                </motion.div>
            </section>
        </ScrollReveal>
    );
}
