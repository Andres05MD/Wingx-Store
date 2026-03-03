'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import imagekitLoader from '@/lib/imagekitLoader';
import { motion } from 'framer-motion';
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
            className="h-full relative group"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
            <Link href={`/productos/${product.id}`} className="block h-full">
                <div className="relative flex flex-col h-full rounded-[1.5rem] overflow-hidden bg-white/40 dark:bg-black/40 backdrop-blur-md border border-neutral-200 dark:border-white/5 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.05)] hover:border-black/5 dark:hover:border-white/10 group-hover:bg-white/80 dark:group-hover:bg-black/80">

                    {/* Image Container */}
                    <div className="relative aspect-[4/5] w-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden rounded-t-[1.5rem] mb-1">
                        {/* Main Image */}
                        <Image
                            src={product.imageUrl}
                            loader={imagekitLoader}
                            alt={product.name}
                            fill
                            className={`object-cover transition-transform duration-1000 ease-out will-change-transform ${product.images && product.images.length > 1 ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`}
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />

                        {/* Second Image (Hover) */}
                        {product.images && product.images.length > 1 && (
                            <Image
                                src={product.images[1]}
                                loader={imagekitLoader}
                                alt={`${product.name} alternate`}
                                fill
                                className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out will-change-transform"
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            />
                        )}

                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        {/* Wishlist Button (Flotante y sutil) */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleWishlist(product);
                            }}
                            className={`absolute top-3 right-3 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white/70 dark:bg-black/50 backdrop-blur-md transition-all duration-300 shadow-sm cursor-pointer active:scale-90 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0
                                ${isInWishlist(product.id) ? 'opacity-100 translate-y-0 text-red-500' : 'text-neutral-500 hover:text-black dark:hover:text-white'}`}
                            aria-label={isInWishlist(product.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                        >
                            <Heart
                                className={`w-4 h-4 transition-colors ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`}
                            />
                        </button>
                    </div>

                    {/* Info Section */}
                    <div className="p-4 sm:p-5 flex flex-col flex-grow transition-colors duration-500">
                        {/* Categoría minimalista */}
                        <div className="flex items-center gap-2 mb-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            <span className="w-1.5 h-1.5 rounded-full bg-black/20 dark:bg-white/20" />
                            <span className="text-[10px] sm:text-xs text-neutral-500 tracking-[0.2em] uppercase font-bold">
                                {product.category || 'Colección'}
                            </span>
                        </div>

                        {/* Product Name */}
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-black dark:text-white line-clamp-2 leading-snug mb-2 font-heading tracking-tight group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
                            {product.name}
                        </h3>

                        {/* Price + Arrow Indicator */}
                        <div className="mt-auto flex items-center justify-between pt-2">
                            <span className="text-base sm:text-lg lg:text-xl font-semibold text-neutral-700 dark:text-neutral-300 tabular-nums">
                                {priceFormatted}
                            </span>

                            {/* Hover Arrow Effect */}
                            <div className="w-6 h-6 rounded-full flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                <ArrowRight className="w-4 h-4 text-black dark:text-white" />
                            </div>
                        </div>
                    </div>

                </div>
            </Link>
        </motion.div>
    );
}
