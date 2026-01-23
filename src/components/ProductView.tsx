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

// Map of color names to CSS color values
const COLOR_MAP: Record<string, string> = {
    'Negro': '#000000',
    'Blanco': '#FFFFFF',
    'Rojo': '#EF4444',
    'Azul': '#3B82F6',
    'Azul Marino': '#1E3A5F',
    'Azul Cielo': '#87CEEB',
    'Verde': '#22C55E',
    'Verde Oliva': '#556B2F',
    'Amarillo': '#EAB308',
    'Naranja': '#F97316',
    'Rosa': '#EC4899',
    'Morado': '#A855F7',
    'Gris': '#6B7280',
    'Gris Claro': '#D1D5DB',
    'Marrón': '#92400E',
    'Beige': '#D4B896',
    'Crema': '#FFFDD0',
    'Coral': '#FF7F50',
    'Turquesa': '#40E0D0',
    'Lavanda': '#E6E6FA',
    'Borgoña': '#800020',
    'Terracota': '#E2725B',
    'Menta': '#98FF98',
    'Vino': '#722F37',
    'Caqui': '#C3B091'
};

export default function ProductView({ product }: ProductViewProps) {
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
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

        if (!selectedColor && product.colors && product.colors.length > 0) {
            Swal.fire({
                title: 'Color requerido',
                text: 'Por favor selecciona un color para continuar.',
                icon: 'warning',
                background: '#0f172a',
                color: '#f8fafc',
                confirmButtonColor: '#3b82f6',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        addToCart(product, selectedSize, selectedColor);
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

                    {/* Colors Selector */}
                    {product.colors && product.colors.length > 0 && (
                        <ScrollReveal delay={0.35} direction="right">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="block text-sm font-medium text-neutral-700 dark:text-white">
                                        Selecciona el color
                                        {selectedColor && (
                                            <span className="ml-2 text-blue-600 dark:text-blue-400 font-semibold">
                                                — {selectedColor}
                                            </span>
                                        )}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {product.colors.map((color) => {
                                        // Combine predefined colors with custom colors from the product
                                        const combinedColorMap = { ...COLOR_MAP, ...(product.customColorMap || {}) };
                                        const colorValue = combinedColorMap[color] || '#888888';
                                        const isLightColor = ['Blanco', 'Crema', 'Beige', 'Amarillo', 'Gris Claro', 'Lavanda', 'Menta'].includes(color)
                                            || (colorValue.toLowerCase() === '#ffffff' || colorValue.toLowerCase() === '#fffdd0');

                                        return (
                                            <motion.button
                                                key={color}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setSelectedColor(color)}
                                                title={color}
                                                className={`relative w-10 h-10 rounded-full transition-all duration-200 flex items-center justify-center
                                                    ${selectedColor === color
                                                        ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-slate-900'
                                                        : 'hover:ring-2 hover:ring-offset-2 hover:ring-black/20 dark:hover:ring-white/20 dark:hover:ring-offset-slate-900'
                                                    }
                                                    ${isLightColor ? 'border border-black/20 dark:border-white/20' : ''}
                                                `}
                                                style={{ backgroundColor: colorValue }}
                                            >
                                                {selectedColor === color && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className={`w-4 h-4 rounded-full ${isLightColor ? 'bg-black/60' : 'bg-white/80'}`}
                                                    />
                                                )}
                                            </motion.button>
                                        );
                                    })}
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



            <RecentlyViewed excludeProductId={product.id} />
            <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
        </div>
    );
}
