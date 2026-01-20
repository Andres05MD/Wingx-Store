'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import imagekitLoader from '@/lib/imagekitLoader';
import { motion } from 'framer-motion';
import GlowButton from './GlowButton';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, ArrowRight } from 'lucide-react';

export default function ProductCard({ product }: { product: Product }) {
    const { toggleWishlist, isInWishlist } = useWishlist();

    const priceFormatted = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(product.price);

    return (
        <motion.div
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
        >
            <Link href={`/productos/${product.id}`} className="group block h-full">
                <div className="glass-card rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-black/5 dark:border-white/5 flex flex-col h-full bg-white dark:bg-neutral-900">
                    <div className="relative aspect-[4/5] w-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                        {/* Main Image */}
                        <Image
                            src={product.imageUrl}
                            loader={imagekitLoader}
                            alt={product.name}
                            fill
                            className={`object-cover transition-transform duration-700 ${product.images && product.images.length > 1 ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />

                        {/* Second Image (Hover) */}
                        {product.images && product.images.length > 1 && (
                            <Image
                                src={product.images[1]} // Use the second image
                                loader={imagekitLoader}
                                alt={`${product.name} alternate`}
                                fill
                                className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        )}
                        <div className="absolute inset-0 bg-black/5 dark:bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <div className="p-3 sm:p-4 flex flex-col flex-grow">
                        <h3 className="text-sm sm:text-md font-medium text-black dark:text-white line-clamp-2 leading-tight mb-1 sm:mb-2">
                            {product.name}
                        </h3>
                        <p className="text-neutral-500 dark:text-neutral-400 text-[10px] sm:text-xs uppercase tracking-wider mb-2 sm:mb-3">
                            {product.category || 'Casual'}
                        </p>
                        <div className="mt-auto flex items-end justify-between gap-2">
                            <span className="text-base sm:text-lg font-bold text-black dark:text-white truncate">{priceFormatted}</span>
                            <div className="shrink-0">
                                <GlowButton className="!px-3 !py-1.5 sm:!px-4 sm:!py-2">
                                    <span className="hidden sm:inline">Ver detalles</span>
                                    <ArrowRight size={16} className="sm:hidden" />
                                </GlowButton>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product);
                }}
                className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm text-neutral-500 dark:text-neutral-400 hover:text-red-500 hover:scale-110 transition-all shadow-sm"
            >
                <Heart
                    size={20}
                    className={`transition-colors ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`}
                />
            </button>
        </motion.div>
    );
}
