import { getFeaturedProducts } from "@/services/productService";
import ProductCard from "@/components/ProductCard";
import HomeBanner from "@/components/HomeBanner";
import PaginationControls from "@/components/ui/PaginationControls";
import InfiniteMarquee from "@/components/ui/InfiniteMarquee";
import InfoSections from "@/components/InfoSections";

import { Product } from "@/types";

// Revalidate/update cache every 60 seconds (ISR) - Mejor rendimiento y menos costos que force-dynamic
export const revalidate = 60;

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; category?: string; page?: string }>;
}) {
    const products = await getFeaturedProducts();
    const resolvedSearchParams = await searchParams;
    const searchTerm = resolvedSearchParams.search?.toLowerCase() || '';
    const categoryFilter = resolvedSearchParams.category || 'Todos';

    // Pagination settings
    const PAGE_SIZE = 12; // 3 rows * 4 columns
    const currentPage = Number(resolvedSearchParams.page) || 1;

    // Default Categories (Extract unique categories from products)
    const categories = ['Todos', ...Array.from(new Set(products.flatMap(p => p.categories || [p.category || 'Varios'])))];

    // Filter Logic
    let filteredProducts = products;

    // 1. Filter by Category
    if (categoryFilter !== 'Todos') {
        filteredProducts = filteredProducts.filter(p =>
            (p.categories && p.categories.includes(categoryFilter)) ||
            p.category === categoryFilter
        );
    }

    // 2. Filter by Search Term
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            (product.categories && product.categories.some(cat => cat.toLowerCase().includes(searchTerm)))
        );
    }

    const totalItems = filteredProducts.length;
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const currentProducts = filteredProducts.slice(start, end);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Hero Section / Banner */}
            <HomeBanner
                title={searchTerm ? `Resultados para "${resolvedSearchParams.search}"` : 'Bienvenido a Wingx'}
                subtitle={searchTerm ? 'Explora lo que encontramos para ti.' : 'Diseño exclusivo y confección de alta calidad, pensados para ti.'}
                showResetLink={!!(searchTerm && filteredProducts.length === 0)}
            />

            {!searchTerm && (
                <>
                    <InfoSections />
                </>
            )}

            <div className="w-full mx-auto py-8 md:py-12">
                {/* Main Content */}
                <main className="flex-1">
                    {/* Product Grid */}
                    {currentProducts.length > 0 ? (
                        <>
                            <div id="product-grid" className="mb-10 md:mb-14">
                                <div className="flex items-end justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 tracking-[0.25em] uppercase">
                                                Colección
                                            </span>
                                            <span className="h-px w-12 bg-gradient-to-r from-black/15 to-transparent dark:from-white/15" />
                                        </div>
                                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-[-0.03em] font-heading text-black dark:text-white leading-[1.1]">
                                            {searchTerm ? 'Resultados de búsqueda' : (categoryFilter !== 'Todos' ? categoryFilter : 'Prendas Destacadas')}
                                        </h2>
                                    </div>
                                    <a href="/catalogo" className="hidden md:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-neutral-500 hover:text-black dark:hover:text-white transition-colors pb-2">
                                        Ver todo
                                        <span className="w-4 h-px bg-current" />
                                    </a>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {currentProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            <PaginationControls
                                totalItems={totalItems}
                                pageSize={PAGE_SIZE}
                                currentPage={currentPage}
                            />
                        </>
                    ) : (
                        <div className="relative text-center py-20 rounded-[2rem] border border-dashed border-black/[0.06] dark:border-white/[0.06] bg-neutral-50/80 dark:bg-neutral-950/60 overflow-hidden">
                            {/* Orbe decorativo */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-black/[0.02] dark:bg-white/[0.02] blur-3xl pointer-events-none" />
                            <div className="relative z-10">
                                <p className="text-neutral-400 dark:text-neutral-500 text-base">
                                    {searchTerm
                                        ? `No encontramos productos que coincidan con "${resolvedSearchParams.search}".`
                                        : "No se encontraron productos en esta categoría."}
                                </p>
                                <a href="/" className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-black dark:text-white hover:opacity-70 transition-opacity">
                                    Ver todos los productos
                                    <span className="text-xs">→</span>
                                </a>
                            </div>
                        </div>
                    )}
                </main>
            </div>


        </div>
    );
}

