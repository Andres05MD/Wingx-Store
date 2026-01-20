'use client';

import { useState } from 'react';
import Image from 'next/image';
import imagekitLoader from '@/lib/imagekitLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

interface ImageGalleryProps {
    images: string[];
    productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
    const [activeImage, setActiveImage] = useState(images[0]);
    const [isZoomed, setIsZoomed] = useState(false);

    return (
        <>
            <div className="flex flex-col gap-4 w-full">
                {/* Main Image with Zoom */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="relative w-full aspect-[4/5] md:aspect-square lg:aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shadow-sm border border-black/5 dark:border-white/5 group cursor-zoom-in"
                    onClick={() => setIsZoomed(true)}
                >
                    <Image
                        key={activeImage}
                        src={activeImage}
                        loader={imagekitLoader}
                        alt={productName}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />

                    {/* Zoom indicator */}
                    <div className="absolute top-4 right-4 bg-black/50 dark:bg-white/50 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ZoomIn className="w-5 h-5 text-white dark:text-black" />
                    </div>
                </motion.div>

                {/* Thumbnails Gallery */}
                {images.length > 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
                    >
                        {images.map((img, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveImage(img)}
                                className={`relative flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 ${activeImage === img
                                        ? 'border-black dark:border-white scale-105 shadow-lg'
                                        : 'border-transparent opacity-70 hover:opacity-100'
                                    }`}
                            >
                                <Image
                                    src={img}
                                    loader={imagekitLoader}
                                    alt={`${productName} view ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                />
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {isZoomed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsZoomed(false)}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
                    >
                        <button
                            onClick={() => setIsZoomed(false)}
                            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>

                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="relative max-w-5xl w-full aspect-square"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={activeImage}
                                loader={imagekitLoader}
                                alt={productName}
                                fill
                                className="object-contain"
                                sizes="(max-width: 1280px) 100vw, 1280px"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
