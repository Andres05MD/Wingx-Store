"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import PaginationControls from "@/components/ui/PaginationControls";
import { Product } from "@/types";
import { PackageOpen } from "lucide-react";

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
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="text-center py-24 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30"
            >
                <PackageOpen className="w-12 h-12 mx-auto mb-4 text-neutral-300 dark:text-neutral-600" strokeWidth={1.2} />
                <p className="text-neutral-500 dark:text-neutral-400 text-base font-medium">
                    No se encontraron productos con estos filtros.
                </p>
                <p className="text-neutral-400 dark:text-neutral-500 text-sm mt-1">
                    Intenta con otra categoría o término de búsqueda.
                </p>
            </motion.div>
        );
    }

    return (
        <>

            {/* Product Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product, index) => (
                    <motion.div
                        key={product.id}
                        className="h-full"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{
                            duration: 0.4,
                            delay: (index % 4) * 0.08,
                            ease: [0.16, 1, 0.3, 1]
                        }}
                    >
                        <ProductCard product={product} />
                    </motion.div>
                ))}
            </div>

            {/* Pagination */}
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
