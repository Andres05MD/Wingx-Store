'use client';

import { Product } from '@/types';
import ProductCard from './ProductCard';
import ScrollReveal from './ScrollReveal';

interface RelatedProductsProps {
    products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
    if (products.length === 0) return null;

    return (
        <section className="border-t border-black/10 dark:border-white/10 pt-12">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-8">
                Productos Similares
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
