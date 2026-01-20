'use client';

import { Product } from '@/types';
import ProductCard from './ProductCard';
import ScrollReveal from './ScrollReveal';
import { motion } from 'framer-motion';

interface RelatedProductsProps {
    products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
    if (products.length === 0) return null;

    return (
        <section className="border-t border-black/10 dark:border-white/10 pt-12">
            <ScrollReveal>
                <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-3xl font-bold text-black dark:text-white mb-8"
                >
                    Productos Similares
                </motion.h2>
            </ScrollReveal>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {products.map((product, index) => (
                    <ScrollReveal key={product.id} delay={index * 0.1}>
                        <ProductCard product={product} />
                    </ScrollReveal>
                ))}
            </div>
        </section>
    );
}
