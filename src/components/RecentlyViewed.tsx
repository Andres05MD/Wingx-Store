'use client';

import { Product } from '@/types';
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ScrollReveal from './ScrollReveal';
import { motion } from 'framer-motion';

interface RecentlyViewedProps {
    excludeProductId?: string;
    excludeProductIds?: string[];
}

export default function RecentlyViewed({ excludeProductId, excludeProductIds = [] }: RecentlyViewedProps) {
    const [recentProducts, setRecentProducts] = useState<Product[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('wingx_recently_viewed');
        if (stored) {
            try {
                let products: Product[] = JSON.parse(stored);

                // Filtrar el producto actual y cualquiera explícitamente excluido
                products = products.filter(p => {
                    if (excludeProductId && p.id === excludeProductId) return false;
                    if (excludeProductIds.length > 0 && excludeProductIds.includes(p.id)) return false;
                    return true;
                });

                // Obtener últimos 4 productos visitados
                setRecentProducts(products.slice(0, 4));
            } catch (e) {
                console.error('Error loading recently viewed', e);
            }
        }
    }, [excludeProductId, excludeProductIds]);

    if (recentProducts.length === 0) return null;

    return (
        <section className="border-t border-black/10 dark:border-white/10 pt-12 mt-12">
            <ScrollReveal>
                <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-2xl font-bold text-black dark:text-white mb-6"
                >
                    Visto Recientemente
                </motion.h2>
            </ScrollReveal>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {recentProducts.map((product, index) => (
                    <ScrollReveal key={product.id} delay={index * 0.1}>
                        <ProductCard product={product} />
                    </ScrollReveal>
                ))}
            </div>
        </section>
    );
}

// Función utilitaria para agregar al historial
export const addToRecentlyViewed = (product: Product) => {
    if (typeof window === 'undefined') return;

    try {
        const stored = localStorage.getItem('wingx_recently_viewed');
        let products: Product[] = stored ? JSON.parse(stored) : [];

        // Eliminar duplicado si existe
        products = products.filter(p => p.id !== product.id);

        // Agregar al inicio
        products.unshift(product);

        // Limitar a 10
        if (products.length > 10) {
            products = products.slice(0, 10);
        }

        localStorage.setItem('wingx_recently_viewed', JSON.stringify(products));
    } catch (e) {
        console.error('Error saving recently viewed', e);
    }
};
