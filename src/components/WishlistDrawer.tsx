'use client';

import { useWishlist } from '@/context/WishlistContext';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import PremiumButton from './PremiumButton';
import Drawer from '@/components/ui/Drawer';
import { formatPrice } from '@/lib/utils';

export default function WishlistDrawer() {
    const { isWishlistOpen, setIsWishlistOpen, wishlist, removeFromWishlist } = useWishlist();

    return (
        <Drawer
            isOpen={isWishlistOpen}
            onClose={() => setIsWishlistOpen(false)}
            title="Mis Favoritos"
            icon={Heart}
            count={wishlist.length}
        >
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {wishlist.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                        <div className="w-16 h-16 bg-neutral-100 dark:bg-white/5 rounded-full flex items-center justify-center">
                            <Heart size={32} className="text-neutral-400" />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-neutral-900 dark:text-white">Tu lista está vacía</p>
                            <p className="text-neutral-500 text-sm mt-1">Guarda tus prendas favoritas aquí.</p>
                        </div>
                        <button
                            onClick={() => setIsWishlistOpen(false)}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                            Explorar catálogo
                        </button>
                    </div>
                ) : (
                    wishlist.map((item) => (
                        <div
                            key={item.id}
                            className="flex gap-4 p-4 rounded-xl border border-neutral-100 dark:border-white/5 bg-neutral-50/50 dark:bg-white/[0.02]"
                        >
                            <Link
                                href={`/productos/${item.id}`}
                                onClick={() => setIsWishlistOpen(false)}
                                className="relative w-24 h-28 flex-shrink-0 bg-neutral-100 dark:bg-white/5 rounded-lg overflow-hidden group"
                            >
                                <Image
                                    src={item.imageUrl || '/no-image.svg'}
                                    alt={item.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    sizes="100px"
                                />
                            </Link>

                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <div className="flex justify-between items-start gap-2">
                                        <Link href={`/productos/${item.id}`} onClick={() => setIsWishlistOpen(false)}>
                                            <h3 className="font-semibold text-neutral-900 dark:text-white hover:underline line-clamp-2">
                                                {item.name}
                                            </h3>
                                        </Link>
                                        <button
                                            onClick={() => removeFromWishlist(item.id)}
                                            className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    {item.category && (
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                            {item.category}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                    <p className="font-bold text-neutral-900 dark:text-white">
                                        {formatPrice(item.price)}
                                    </p>
                                    <Link
                                        href={`/productos/${item.id}`}
                                        onClick={() => setIsWishlistOpen(false)}
                                    >
                                        <PremiumButton variant="solid" className="!py-1.5 !px-4 !min-h-0 !text-xs">
                                            <ShoppingBag size={14} />
                                            <span>Ver</span>
                                        </PremiumButton>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Drawer>
    );
}
