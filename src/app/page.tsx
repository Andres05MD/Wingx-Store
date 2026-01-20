import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProductCard from "@/components/ProductCard";
import HomeBanner from "@/components/HomeBanner";
import PaginationControls from "@/components/ui/PaginationControls";
import InfiniteMarquee from "@/components/ui/InfiniteMarquee";
import InfoSections from "@/components/InfoSections";
// Removed CategoryGrid

import { Product } from "@/types";

// Revalidate/update cache every 60 seconds (ISR) - Mejor rendimiento y menos costos que force-dynamic
export const revalidate = 60;

async function getProducts(): Promise<Product[]> {
    try {
        const productsRef = collection(db, "productos");
        const snapshot = await getDocs(productsRef);

        if (snapshot.empty) {
            return [];
        }

        const allProducts = snapshot.docs.map((doc) => {
            const data = doc.data();

            // Normalize categories
            let categories: string[] = [];
            if (data.categories && Array.isArray(data.categories)) {
                categories = data.categories;
            } else if (data.category && typeof data.category === 'string') {
                categories = [data.category];
            } else {
                categories = ['Sin Categoría'];
            }

            return {
                id: doc.id,
                name: data.name || 'Sin Nombre',
                price: typeof data.price === 'number' ? data.price : 0,
                description: data.description || '',
                imageUrl: data.imageUrl || 'https://via.placeholder.com/400x500?text=No+Image',
                // Keep legacy category for now to avoid breaking other things immediately, but use categories primarily
                category: categories[0] || 'Varios',
                categories: categories,
                gender: data.gender || 'Unisex',
                ...data,
            } as Product;
        });

        // Filter only featured products
        return allProducts.filter(p => p.featured === true);

    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; category?: string; page?: string }>;
}) {
    const products = await getProducts();
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
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hero Section / Banner */}
            <HomeBanner
                title={searchTerm ? `Resultados para "${resolvedSearchParams.search}"` : 'Bienvenido a Wingx'}
                subtitle={searchTerm ? 'Explora lo que encontramos para ti.' : 'Diseño exclusivo y confección de alta calidad, pensados para ti.'}
                showResetLink={!!(searchTerm && filteredProducts.length === 0)}
            />

            {!searchTerm && (
                <>
                    <InfoSections />
                    {/* CategoryGrid removed from here */}
                </>
            )}

            <div className="w-full mx-auto px-4 py-8">
                {/* Sidebar Removed */}


                {/* Main Content */}
                <main className="flex-1">
                    {/* Product Grid */}
                    {currentProducts.length > 0 ? (
                        <>
                            <h2 id="product-grid" className="text-xl md:text-2xl font-bold tracking-tight mb-4 md:mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 md:h-8 rounded-full bg-purple-600 inline-block"></span>
                                {searchTerm ? 'Resultados de búsqueda' : (categoryFilter !== 'Todos' ? categoryFilter : 'Prendas Destacadas')}
                            </h2>
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
                        <div className="text-center py-20 glass-card rounded-2xl border-2 border-dashed border-black/10 dark:border-white/10 bg-white dark:bg-black/50">
                            <p className="text-neutral-500 dark:text-neutral-400 text-lg">
                                {searchTerm
                                    ? `No encontramos productos que coincidan con "${resolvedSearchParams.search}".`
                                    : "No se encontraron productos en esta categoría."}
                            </p>
                            <a href="/" className="inline-block mt-4 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline">
                                Ver todos los productos
                            </a>
                        </div>
                    )}
                </main>
            </div>


        </div>
    );
}
