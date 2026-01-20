"use client";

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface CatalogFiltersProps {
    categories: string[];
}

export default function CatalogFilters({ categories }: CatalogFiltersProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const currentCategory = searchParams.get('category') || 'Todos';


    const handleCategoryChange = (category: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1'); // Reset to page 1

        if (category === 'Todos') {
            params.delete('category');
        } else {
            params.set('category', category);
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="space-y-6">
            {/* Search Bar */}


            {/* Categories */}
            <div className="flex flex-wrap items-center justify-center gap-2">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${currentCategory === cat
                            ? 'bg-black text-white dark:bg-white dark:text-black border-transparent shadow-lg'
                            : 'bg-transparent text-neutral-600 dark:text-neutral-400 border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    );
}
