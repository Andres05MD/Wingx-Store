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
    categories?: string[]; // Optional, we use the constant primarily now
}

export default function CatalogSidebar({ categories }: CatalogSidebarProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    // State for expanded categories in sidebar
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
        params.set('page', '1'); // Reset to page 1

        if (category === 'Todos') {
            params.delete('category');
        } else {
            params.set('category', category);
        }
        replace(`${pathname}?${params.toString()}`, { scroll: false });
        if (window.innerWidth < 768) setIsOpen(false); // Close mobile menu on selection
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
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-medium"
                >
                    <PiFunnelBold className="w-5 h-5" />
                    Filtrar por Categoría
                </button>
            </div>

            {/* Sidebar Content */}
            <div className={`
                fixed inset-0 z-50 bg-white dark:bg-neutral-900 p-6 md:p-0 md:static md:bg-transparent md:dark:bg-transparent md:block
                ${isOpen ? 'block' : 'hidden'}
                overflow-y-auto md:overflow-visible
            `}>
                <div className="flex items-center justify-between md:hidden mb-6">
                    <h2 className="text-xl font-bold">Filtros</h2>
                    <button onClick={toggleSidebar} className="p-2">
                        <PiXBold className="w-6 h-6" />
                    </button>
                </div>

                <div className="md:sticky md:top-24 flex flex-col gap-4">

                    {/* Categories Area */}
                    <div className="w-full pr-4">
                        <div className="hidden md:flex items-center gap-2 mb-4 text-primary">
                            <PiFunnelBold className="w-5 h-5" />
                            <h2 className="text-lg font-bold">Categorías</h2>
                        </div>

                        <div className="flex flex-col space-y-1 bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-100 dark:border-white/5">
                            {/* All Products Option */}
                            <button
                                onClick={() => handleCategoryChange('Todos')}
                                className={`text-left px-4 py-2 rounded-lg text-sm font-bold transition-all ${currentCategory === 'Todos' ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg shadow-black/10 dark:shadow-white/10' : 'hover:bg-white dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                                    }`}
                            >
                                Todos los Productos
                            </button>

                            <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-2 mx-2" />

                            {Object.entries(PRODUCT_CATEGORIES).map(([mainCat, subCats]) => {
                                const isExpanded = expandedCategories.includes(mainCat);
                                const isActiveMain = currentCategory === mainCat;

                                return (
                                    <div key={mainCat} className="space-y-1">
                                        <div className="flex items-center justify-between group">
                                            <button
                                                onClick={() => handleCategoryChange(mainCat)}
                                                className={`flex-1 text-left px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isActiveMain
                                                    ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/10'
                                                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                                    }`}
                                            >
                                                {mainCat}
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleExpand(mainCat); }}
                                                className="p-2 text-neutral-400 hover:text-black dark:hover:text-white"
                                            >
                                                {isExpanded ? <PiCaretDownBold /> : <PiCaretRightBold />}
                                            </button>
                                        </div>

                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden ml-4 pl-2 border-l border-neutral-200 dark:border-neutral-800 space-y-1"
                                                >
                                                    {subCats.map(sub => {
                                                        const isActiveSub = currentCategory === sub;
                                                        return (
                                                            <button
                                                                key={sub}
                                                                onClick={() => handleCategoryChange(sub)}
                                                                className={`block w-full text-left px-4 py-1.5 rounded-md text-sm transition-all ${isActiveSub
                                                                    ? 'text-purple-600 dark:text-purple-400 font-medium bg-purple-50 dark:bg-purple-900/10'
                                                                    : 'text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                                                                    }`}
                                                            >
                                                                {sub}
                                                            </button>
                                                        );
                                                    })}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Fixed Custom Order Card */}
                    <div className="shrink-0 pb-2">
                        <CustomOrderCard />
                    </div>
                </div>
            </div>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={toggleSidebar}
                />
            )}
        </>
    );
}
