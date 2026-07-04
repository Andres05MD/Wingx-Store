'use client';

import { Product } from '@/types';
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
interface RecentlyViewedProps {
    excludeProductId?: string;
    excludeProductIds?: string[];
}

export default function RecentlyViewed({ excludeProductId, excludeProductIds = [] }: RecentlyViewedProps) {
    const [recentProducts, setRecentProducts] = useState<Product[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('wingx_recently_viewed');
        if (!stored) return;

        try {
            let products: Product[] = JSON.parse(stored);

            products = products.filter(p => {
                if (excludeProductId && p.id === excludeProductId) return false;
                if (excludeProductIds.length > 0 && excludeProductIds.includes(p.id)) return false;
                return true;
            });

            if (products.length === 0) return;

            // Verificar qué productos siguen existiendo en Firestore
            import('firebase/firestore').then(({ collection, getDocs, query, where }) => {
                import('@/lib/firebase').then(({ db }) => {
                    const ids = products.map(p => p.id);
                    const q = query(collection(db, 'productos'), where('__name__', 'in', ids));
                    getDocs(q).then(snapshot => {
                        const validIds = new Set(snapshot.docs.map(d => d.id));
                        const valid = products.filter(p => validIds.has(p.id));
                        setRecentProducts(valid.slice(0, 4));

                        // Limpiar localStorage si hay productos inválidos
                        if (valid.length !== products.length) {
                            localStorage.setItem('wingx_recently_viewed', JSON.stringify(valid));
                        }
                    });
                });
            });
        } catch (e) {
            console.error('Error loading recently viewed', e);
        }
    }, [excludeProductId, excludeProductIds]);

    if (recentProducts.length === 0) return null;

    return (
        <section className="border-t border-black/10 dark:border-white/10 pt-12 mt-12">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
                Visto Recientemente
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {recentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
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
