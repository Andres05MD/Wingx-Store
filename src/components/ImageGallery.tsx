'use client';

import { useState, useRef, useEffect } from 'react';
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
    const [currentSlide, setCurrentSlide] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Handle scroll for mobile dots
    const handleScroll = () => {
        if (scrollRef.current) {
            const width = scrollRef.current.offsetWidth;
            const scrollLeft = scrollRef.current.scrollLeft;
            const index = Math.round(scrollLeft / width);
            setCurrentSlide(index);
        }
    };

    return (
        <>
            {/* Mobile Carousel (Hidden on Desktop) */}
            <div className="md:hidden relative w-full max-w-[300px] mx-auto">
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide aspect-square rounded-2xl bg-neutral-100 dark:bg-neutral-800"
                >
                    {images.map((img, idx) => (
                        <div key={idx} className="w-full flex-shrink-0 snap-center relative h-full">
                            <Image
                                src={img}
                                loader={imagekitLoader}
                                alt={`${productName} - ${idx + 1}`}
                                fill
                                className="object-cover"
                                sizes="100vw"
                                priority={idx === 0}
                            />
                        </div>
                    ))}
                </div>

                {/* Dots Indicator */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-2 rounded-full transition-all duration-300 shadow-sm ${currentSlide === idx
                                    ? 'w-6 bg-white'
                                    : 'w-2 bg-white/50 backdrop-blur-sm'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Desktop Gallery (Hidden on Mobile) */}
            <div className="hidden md:flex flex-col gap-4 w-full">
                {/* Main Image with Zoom */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="relative w-full aspect-square lg:aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shadow-sm border border-black/5 dark:border-white/5 group cursor-zoom-in"
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
                        sizes="50vw"
                    />

                    {/* Zoom indicator */}
                    <div className="absolute top-4 right-4 bg-black/50 dark:bg-white/50 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ZoomIn className="w-5 h-5 text-white dark:text-black" />
                    </div>
                </motion.div>

                {/* Thumbnails Gallery */}
                {images.length > 1 && (
                    <div className="grid grid-cols-5 gap-3">
                        {images.map((img, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveImage(img)}
                                className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all duration-300 ${activeImage === img
                                    ? 'border-black dark:border-white opacity-100 ring-2 ring-black/10 dark:ring-white/10'
                                    : 'border-transparent opacity-60 hover:opacity-100'
                                    }`}
                            >
                                <Image
                                    src={img}
                                    loader={imagekitLoader}
                                    alt={`${productName} view ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="100px"
                                />
                            </motion.button>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox Modal (Shared) */}
            <AnimatePresence>
                {isZoomed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsZoomed(false)}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
                    >
                        <button
                            onClick={() => setIsZoomed(false)}
                            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-[101]"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>

                        <div
                            className="relative w-full h-full flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Keep it simple for lightbox - just show active desktop or first image if came from mobile (though mobile doesn't trigger this yet) */}
                            <Image
                                src={activeImage} // Ideally track clicked image for lightbox even on mobile, but keep simple for now
                                loader={imagekitLoader}
                                alt={productName}
                                fill
                                className="object-contain"
                                sizes="100vw"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
