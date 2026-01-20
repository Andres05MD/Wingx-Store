"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import PaginationControls from "@/components/ui/PaginationControls";
import { Product } from "@/types";

interface AnimatedProductGridProps {
    products: Product[];
    totalItems: number;
    pageSize: number;
    currentPage: number;
}

export default function AnimatedProductGrid({
    products,
    totalItems,
    pageSize,
    currentPage
}: AnimatedProductGridProps) {
    if (products.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                className="text-center py-20 glass-card rounded-2xl border-2 border-dashed border-black/10 dark:border-white/10 bg-white dark:bg-black/50"
            >
                <p className="text-neutral-500 dark:text-neutral-400 text-lg">
                    No se encontraron productos con estos filtros.
                </p>
            </motion.div>
        );
    }

    return (
        <>
            <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
                {products.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{
                            duration: 0.4,
                            delay: (index % 4) * 0.1,
                            ease: "easeOut"
                        }}
                    >
                        <ProductCard product={product} />
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
            >
                <PaginationControls
                    totalItems={totalItems}
                    pageSize={pageSize}
                    currentPage={currentPage}
                />
            </motion.div>
        </>
    );
}
