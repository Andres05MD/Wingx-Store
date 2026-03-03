"use client";

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import { PiFunnelBold, PiXBold, PiCaretDownBold, PiCaretRightBold } from "react-icons/pi";
import { useState, useEffect } from 'react';
import CustomOrderCard from './CustomOrderCard';

// Define the hierarchy (Matches Gestion Project)
const PRODUCT_CATEGORIES: Record<string, string[]> = {
    "Camisas": ["Franela", "Casual", "Formal", "Manga Larga", "Manga Corta", "Oversize", "Blusa"],
    "Pantalones": ["Vestir", "Mono", "Joggers", "Jeans", "Cargo", "Shorts", "Leggins"],
    "Conjuntos": ["Deportivo", "Casual", "Formal", "Verano", "Invierno"],
    "Trajes de baño": ["Enterizo", "Bikini", "Short"],
    "Abrigos": ["Poleron", "Chaqueta", "Sueter", "Chaleco", "Cortavientos", "Cardigan"],
    "Vestidos": ["Largo", "Corto", "Fiesta", "Casual"],
    "Accesorios": ["Gorras", "Medias", "Bolsos", "Lentes", "Joyeria", "Cinturones"],
    "Lenceria": ["Conjuntos", "Individuales", "Pijamas", "Batas"],
    "Otros": ["Varios"]
};

interface CatalogSidebarProps {
    categories?: string[];
}

export default function CatalogSidebar({ categories }: CatalogSidebarProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

    const currentCategory = searchParams.get('category') || 'Todos';

    // Auto-expand active category group
    useEffect(() => {
        if (currentCategory !== 'Todos') {
            const activeMain = Object.keys(PRODUCT_CATEGORIES).find(key =>
                key === currentCategory || PRODUCT_CATEGORIES[key].includes(currentCategory)
            );

            if (activeMain) {
                setExpandedCategories(prev => {
                    if (!prev.includes(activeMain)) return [...prev, activeMain];
                    return prev;
                });
            }
        }
    }, [currentCategory]);

    const handleCategoryChange = (category: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');

        if (category === 'Todos') {
            params.delete('category');
        } else {
            params.set('category', category);
        }
        replace(`${pathname}?${params.toString()}`, { scroll: false });
        if (window.innerWidth < 768) setIsOpen(false);
    };

    const toggleSidebar = () => setIsOpen(!isOpen);

    const toggleExpand = (cat: string) => {
        if (expandedCategories.includes(cat)) {
            setExpandedCategories(expandedCategories.filter(c => c !== cat));
        } else {
            setExpandedCategories([...expandedCategories, cat]);
        }
    };

    return (
        <>
            {/* Mobile Filter Button */}
            <div className="md:hidden pb-4">
                <button
                    onClick={toggleSidebar}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-medium text-sm cursor-pointer active:scale-[0.98] transition-transform"
                >
                    <PiFunnelBold className="w-4 h-4" />
                    Filtrar por Categoría
                </button>
            </div>

            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                        onClick={toggleSidebar}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Content — Slide-in drawer on mobile */}
            <AnimatePresence>
                {(isOpen || typeof window === 'undefined') && (
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-y-0 left-0 z-50 w-[280px] bg-white dark:bg-neutral-950 p-6 shadow-2xl md:hidden overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold font-heading tracking-tight">Categorías</h2>
                            <button onClick={toggleSidebar} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer">
                                <PiXBold className="w-5 h-5" />
                            </button>
                        </div>

                        <SidebarContent
                            currentCategory={currentCategory}
                            expandedCategories={expandedCategories}
                            onCategoryChange={handleCategoryChange}
                            onToggleExpand={toggleExpand}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <div className="sticky top-24 flex flex-col gap-5">
                    <div className="flex items-center gap-2 text-black dark:text-white">
                        <PiFunnelBold className="w-4 h-4" />
                        <h2 className="text-sm font-bold uppercase tracking-widest">Categorías</h2>
                    </div>

                    <SidebarContent
                        currentCategory={currentCategory}
                        expandedCategories={expandedCategories}
                        onCategoryChange={handleCategoryChange}
                        onToggleExpand={toggleExpand}
                    />

                    <CustomOrderCard />
                </div>
            </div>
        </>
    );
}

/* ──────── Extracted sidebar content for reuse ──────── */

function SidebarContent({
    currentCategory,
    expandedCategories,
    onCategoryChange,
    onToggleExpand,
}: {
    currentCategory: string;
    expandedCategories: string[];
    onCategoryChange: (cat: string) => void;
    onToggleExpand: (cat: string) => void;
}) {
    return (
        <div className="flex flex-col space-y-0.5">
            {/* All Products */}
            <button
                onClick={() => onCategoryChange('Todos')}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${currentCategory === 'Todos'
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-black dark:hover:text-white'
                    }`}
            >
                Todos los Productos
            </button>

            <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-2" />

            {Object.entries(PRODUCT_CATEGORIES).map(([mainCat, subCats]) => {
                const isExpanded = expandedCategories.includes(mainCat);
                const isActiveMain = currentCategory === mainCat;
                const hasActiveSub = subCats.includes(currentCategory);

                return (
                    <div key={mainCat}>
                        <div className="flex items-center group">
                            <button
                                onClick={() => onCategoryChange(mainCat)}
                                className={`flex-1 text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 cursor-pointer ${isActiveMain
                                        ? 'font-bold text-black dark:text-white bg-neutral-100 dark:bg-neutral-800/60'
                                        : hasActiveSub
                                            ? 'font-semibold text-black dark:text-white'
                                            : 'font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900'
                                    }`}
                            >
                                {mainCat}
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onToggleExpand(mainCat); }}
                                className="p-1.5 text-neutral-400 hover:text-black dark:hover:text-white rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer"
                                aria-label={`${isExpanded ? 'Contraer' : 'Expandir'} ${mainCat}`}
                            >
                                <motion.div
                                    animate={{ rotate: isExpanded ? 0 : -90 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <PiCaretDownBold className="w-3 h-3" />
                                </motion.div>
                            </button>
                        </div>

                        <AnimatePresence initial={false}>
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                    className="overflow-hidden"
                                >
                                    <div className="ml-3 pl-3 border-l border-neutral-200 dark:border-neutral-800 py-1 space-y-0.5">
                                        {subCats.map(sub => {
                                            const isActiveSub = currentCategory === sub;
                                            return (
                                                <button
                                                    key={sub}
                                                    onClick={() => onCategoryChange(sub)}
                                                    className={`block w-full text-left px-3 py-1.5 rounded-md text-sm transition-all duration-200 cursor-pointer ${isActiveSub
                                                            ? 'text-black dark:text-white font-semibold bg-neutral-100 dark:bg-neutral-800/60'
                                                            : 'text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900'
                                                        }`}
                                                >
                                                    {sub}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}
