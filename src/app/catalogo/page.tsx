
import { getAllProducts } from "@/services/productService";
import { Product } from "@/types";
import CatalogHeader from "@/components/CatalogHeader";
import InfiniteMarquee from "@/components/ui/InfiniteMarquee";
import AnimatedProductGrid from "@/components/AnimatedProductGrid";
import CatalogSidebar from "@/components/CatalogSidebar";

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function CatalogPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; category?: string; page?: string }>;
}) {
    const products = await getAllProducts();
    const resolvedSearchParams = await searchParams;
    const searchTerm = resolvedSearchParams.search?.toLowerCase() || '';
    const categoryFilter = resolvedSearchParams.category || 'Todos';

    // Pagination settings
    const PAGE_SIZE = 12;
    const currentPage = Number(resolvedSearchParams.page) || 1;

    // Filter Logic
    let filteredProducts = products;

    // 1. Filter by Category
    if (categoryFilter !== 'Todos') {
        filteredProducts = filteredProducts.filter((p: Product) =>
            (p.categories && p.categories.includes(categoryFilter)) ||
            p.category === categoryFilter
        );
    }

    // 2. Filter by Search Term
    if (searchTerm) {
        filteredProducts = filteredProducts.filter((product: Product) =>
            product.name.toLowerCase().includes(searchTerm) ||
            (product.categories && product.categories.some((cat: string) => cat.toLowerCase().includes(searchTerm))) ||
            (product.category && product.category.toLowerCase().includes(searchTerm))
        );
    }

    // Pagination Slicing
    const totalItems = filteredProducts.length;
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const currentProducts = filteredProducts.slice(start, end);

    // Categories
    const categories: string[] = ['Todos', ...Array.from(new Set(products.flatMap((p: Product) => p.categories || [p.category || 'Varios'])))];

    // Dynamic header content
    const headerTitle = searchTerm
        ? `Resultados para "${resolvedSearchParams.search}"`
        : categoryFilter !== 'Todos'
            ? categoryFilter
            : 'Catálogo';

    const headerSubtitle = searchTerm
        ? `${totalItems} producto${totalItems !== 1 ? 's' : ''} encontrado${totalItems !== 1 ? 's' : ''}.`
        : 'Explora nuestra colección completa de moda exclusiva.';

    return (
        <div className="min-h-screen">
            <CatalogHeader
                title={headerTitle}
                subtitle={headerSubtitle}
                resultCount={totalItems}
            />

            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                {/* Sidebar */}
                <aside className="w-full md:w-56 lg:w-60 shrink-0">
                    <CatalogSidebar categories={categories} />
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    <AnimatedProductGrid
                        products={currentProducts}
                        totalItems={totalItems}
                        pageSize={PAGE_SIZE}
                        currentPage={currentPage}
                    />
                </main>
            </div>

            {/* Marquee */}
            <div className="-mx-4 mt-10 md:mt-16">
                <InfiniteMarquee items={[
                    "SE REALIZAN ENVÍOS NACIONALES", "•",
                    "ENVÍOS A TODO EL PAÍS", "•",
                    "ENTREGAS SEGURAS", "•",
                    "SE REALIZAN ENVÍOS NACIONALES", "•"
                ]} />
            </div>
        </div>
    );
}
