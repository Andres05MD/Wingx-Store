'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import { MessageCircle, ShoppingCart } from 'lucide-react';
import PremiumButton from './PremiumButton';
import ScrollReveal from './ScrollReveal';
import Breadcrumbs from './Breadcrumbs';
import ImageGallery from './ImageGallery';
import { useCart } from '@/context/CartContext';
import RecentlyViewed, { addToRecentlyViewed } from './RecentlyViewed';
import { Heart, Ruler } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useEffect } from 'react';
import SizeGuideModal from './SizeGuideModal';

interface ProductViewProps {
    product: Product;
}

export default function ProductView({ product }: ProductViewProps) {
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const { toggleWishlist, isInWishlist } = useWishlist();

    useEffect(() => {
        addToRecentlyViewed(product);
    }, [product]);

    // Fallback to single image if images array is empty or undefined
    const images = (product.images && product.images.length > 0) ? product.images : [product.imageUrl];

    const priceFormatted = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(product.price);

    const { addToCart } = useCart();

    const handleAddToCart = () => {
        if (!selectedSize && product.sizes && product.sizes.length > 0) {
            Swal.fire({
                title: 'Talla requerida',
                text: 'Por favor selecciona una talla para continuar.',
                icon: 'warning',
                background: '#0f172a',
                color: '#f8fafc',
                confirmButtonColor: '#3b82f6',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        addToCart(product, selectedSize);
    };

    // Breadcrumbs data
    const breadcrumbItems = [
        { label: 'Catálogo', href: '/catalogo' },
        ...(product.category ? [{ label: product.category, href: `/catalogo?search=${product.category}` }] : []),
        { label: product.name }
    ];

    return (
        <div className="space-y-6">
            {/* Breadcrumbs */}
            <Breadcrumbs items={breadcrumbItems} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Image Section with Zoom */}
                <ScrollReveal direction="left">
                    <ImageGallery images={images} productName={product.name} />
                </ScrollReveal>

                {/* Info Section - Sticky on Desktop */}
                <div className="md:sticky md:top-24 h-fit flex flex-col gap-6">
                    <ScrollReveal delay={0.1} direction="right">
                        <div>
                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-sm font-semibold tracking-wide text-blue-600 dark:text-blue-400 uppercase mb-2"
                            >
                                {product.category || 'MERCANCÍA GENERAL'}
                            </motion.p>
                            <motion.h1
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-3xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white leading-tight mb-2"
                            >
                                {product.name}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-2xl font-medium text-black dark:text-white border-b pb-4 border-black/5 dark:border-white/5"
                            >
                                {priceFormatted}
                            </motion.p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={0.2} direction="right">
                        <div className="prose text-neutral-600 dark:text-neutral-300 leading-relaxed">
                            <p>{product.description}</p>
                        </div>
                    </ScrollReveal>

                    {/* Sizes Selector */}
                    {product.sizes && product.sizes.length > 0 && (
                        <ScrollReveal delay={0.3} direction="right">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="block text-sm font-medium text-neutral-700 dark:text-white">Selecciona tu talla</span>
                                    <button
                                        onClick={() => setIsSizeGuideOpen(true)}
                                        className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                    >
                                        <Ruler size={14} />
                                        Guía de tallas
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {product.sizes.map((size) => (
                                        <motion.button
                                            key={size}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${selectedSize === size
                                                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg font-bold'
                                                    : 'bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/10 hover:border-black/20 dark:hover:border-white/30'
                                                }
                  `}
                                        >
                                            {size}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </ScrollReveal>
                    )}

                    {/* Buy Button */}
                    <ScrollReveal delay={0.4} direction="up">
                        <div className="mt-8">
                            <PremiumButton
                                onClick={handleAddToCart}
                                className="w-full"
                            >
                                <div className="flex items-center justify-center gap-3">
                                    <ShoppingCart className="w-5 h-5" />
                                    <span>Agregar al carrito</span>
                                </div>
                            </PremiumButton>

                            <button
                                onClick={() => toggleWishlist(product)}
                                className={`w-full flex items-center justify-center gap-2 mt-4 py-3 rounded-xl border transition-all duration-300 font-medium ${isInWishlist(product.id)
                                    ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-900/10'
                                    : 'border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'
                                    }`}
                            >
                                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                                {isInWishlist(product.id) ? 'En tu lista de deseos' : 'Agregar a lista de deseos'}
                            </button>
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* Mobile Sticky Action Bar */}
            <div className="md:hidden fixed bottom-[64px] left-0 right-0 p-3 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-t border-neutral-200 dark:border-white/10 z-40 flex items-center gap-3">
                <div className="flex flex-col">
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase font-bold tracking-wider">Precio</span>
                    <span className="text-lg font-bold text-black dark:text-white leading-none">{priceFormatted}</span>
                </div>
                <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-black dark:bg-white text-white dark:text-black h-12 rounded-full font-bold text-sm shadow-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
                >
                    <ShoppingCart size={18} />
                    <span>Agregar al Carrito</span>
                </button>
            </div>

            <RecentlyViewed />
            <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
        </div>
    );
}
