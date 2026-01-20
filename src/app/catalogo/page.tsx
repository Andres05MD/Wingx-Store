
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProductCard from "@/components/ProductCard";
import PaginationControls from "@/components/ui/PaginationControls";
import { Product } from "@/types";
import CatalogHeader from "@/components/CatalogHeader";
import InfiniteMarquee from "@/components/ui/InfiniteMarquee";

import AnimatedProductGrid from "@/components/AnimatedProductGrid";

// Revalidate every 60 seconds
export const revalidate = 60;

// Import the new sidebar
import CatalogSidebar from "@/components/CatalogSidebar";

async function getProducts(): Promise<Product[]> {
    try {
        const productsRef = collection(db, "productos");
        const snapshot = await getDocs(productsRef);

        if (snapshot.empty) return [];

        return snapshot.docs.map((doc) => {
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
                category: categories[0] || 'Varios',
                categories: categories,
                gender: data.gender || 'Unisex',
                ...data,
            } as Product;
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

export default async function CatalogPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; category?: string; page?: string }>;
}) {
    const products = await getProducts();
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
        filteredProducts = filteredProducts.filter(p =>
            (p.categories && p.categories.includes(categoryFilter)) ||
            p.category === categoryFilter
        );
    }

    // 2. Filter by Search Term
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            (product.categories && product.categories.some(cat => cat.toLowerCase().includes(searchTerm))) ||
            (product.category && product.category.toLowerCase().includes(searchTerm))
        );
    }

    // Pagination Slicing
    const totalItems = filteredProducts.length;
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const currentProducts = filteredProducts.slice(start, end);

    // Default Categories (Extract unique categories from products or defined list)
    const categories = ['Todos', ...Array.from(new Set(products.flatMap(p => p.categories || [p.category || 'Varios'])))];

    return (
        <div className="space-y-8 min-h-screen container mx-auto px-4 py-8">
            <div className="-mx-4">
                <InfiniteMarquee items={[
                    "SE REALIZAN ENVÍOS NACIONALES", "•",
                    "ENVÍOS A TODO EL PAÍS", "•",
                    "ENTREGAS SEGURAS", "•",
                    "SE REALIZAN ENVÍOS NACIONALES", "•"
                ]} />
            </div>
            <CatalogHeader />

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <CatalogSidebar categories={categories} />
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    <AnimatedProductGrid
                        products={currentProducts}
                        totalItems={totalItems}
                        pageSize={PAGE_SIZE}
                        currentPage={currentPage}
                    />
                </main>
            </div>
        </div>
    );
}
