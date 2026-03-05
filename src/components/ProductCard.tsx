'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import imagekitLoader from '@/lib/imagekitLoader';
import { motion } from 'framer-motion';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, ShoppingCart } from 'lucide-react';

export default function ProductCard({ product }: { product: Product }) {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const liked = isInWishlist(product.id);

    const precioEntero = Math.floor(product.price);

    return (
        <motion.div
            className="h-full relative group"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
            <Link href={`/productos/${product.id}`} className="block h-full">
                <div className="relative flex flex-col h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 transition-all duration-300 hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_16px_48px_-12px_rgba(255,255,255,0.06)] hover:border-neutral-200 dark:hover:border-neutral-700">

                    {/* Imagen */}
                    <div className="relative aspect-4/5 w-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                        <Image
                            src={product.imageUrl}
                            loader={imagekitLoader}
                            alt={product.name}
                            fill
                            className={`object-cover transition-all duration-500 ease-out will-change-transform ${product.images && product.images.length > 1 ? 'group-hover:opacity-0' : 'group-hover:scale-103'}`}
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />

                        {/* Segunda imagen (hover desktop) */}
                        {product.images && product.images.length > 1 && (
                            <Image
                                src={product.images[1]}
                                loader={imagekitLoader}
                                alt={`${product.name} vista alternativa`}
                                fill
                                className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-103 transition-all duration-500 ease-out will-change-transform"
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            />
                        )}

                        {/* Gradient subtle */}
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                        {/* Wishlist — siempre visible */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleWishlist(product);
                            }}
                            className={`absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-20 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 shadow-sm cursor-pointer active:scale-90
                                ${liked
                                    ? 'bg-red-500 text-white shadow-red-500/25'
                                    : 'bg-white/80 dark:bg-neutral-800/80 text-neutral-400 hover:text-neutral-700 dark:hover:text-white'
                                }`}
                            aria-label={liked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                        >
                            <Heart
                                size={14}
                                strokeWidth={2.5}
                                className={`transition-transform duration-200 ${liked ? 'fill-white scale-110' : ''}`}
                            />
                        </button>

                        {/* Badge categoría */}
                        <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 z-10">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white/80 dark:bg-black/60 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-700 dark:text-neutral-300 shadow-sm">
                                {product.category || 'Colección'}
                            </span>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="p-3 sm:p-4 lg:p-5 flex flex-col grow">
                        {/* Nombre */}
                        <h3 className="text-sm sm:text-base lg:text-lg font-bold text-neutral-900 dark:text-white line-clamp-2 leading-snug mb-2 font-heading tracking-tight">
                            {product.name}
                        </h3>

                        {/* Precio + Carrito */}
                        <div className="mt-auto flex items-center justify-between pt-1.5">
                            <div className="flex items-baseline gap-0.5">
                                <span className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-500 font-medium">$</span>
                                <span className="text-lg sm:text-xl lg:text-2xl font-black text-neutral-900 dark:text-white tabular-nums tracking-tight">
                                    {precioEntero}
                                </span>
                            </div>

                            {/* Ícono carrito — siempre visible, lleva al detalle */}
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-neutral-900 dark:bg-white flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                                <ShoppingCart size={14} className="text-white dark:text-black" strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>

                </div>
            </Link>
        </motion.div>
    );
}
