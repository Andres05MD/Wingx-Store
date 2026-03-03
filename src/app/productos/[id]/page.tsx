import { doc, getDoc, collection, query, where, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProductView from "@/components/ProductView";
import { Product } from "@/types";
import { notFound } from "next/navigation";
import RelatedProducts from "@/components/RelatedProducts";
import type { Metadata } from "next";

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

async function getProduct(id: string): Promise<Product | null> {
    try {
        const docRef = doc(db, "productos", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                name: data.name || 'Sin Nombre',
                price: typeof data.price === 'number' ? data.price : 0,
                description: data.description || '',
                imageUrl: data.imageUrl || '/no-image.svg',
                category: data.category || 'Varios',
                ...data
            } as Product;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

async function getRelatedProducts(category: string, currentProductId: string, maxResults: number = 4): Promise<Product[]> {
    try {
        const productsRef = collection(db, "productos");
        const q = query(
            productsRef,
            where("category", "==", category),
            limit(maxResults + 1) // Get one extra to filter out current product
        );

        const querySnapshot = await getDocs(q);
        const products: Product[] = [];

        querySnapshot.forEach((doc) => {
            if (doc.id !== currentProductId) {
                const data = doc.data();
                products.push({
                    id: doc.id,
                    name: data.name || 'Sin Nombre',
                    price: typeof data.price === 'number' ? data.price : 0,
                    description: data.description || '',
                    imageUrl: data.imageUrl || '/no-image.svg',
                    category: data.category || 'Varios',
                    ...data
                } as Product);
            }
        });

        return products.slice(0, maxResults);
    } catch (error) {
        console.error("Error fetching related products:", error);
        return [];
    }
}

// SEO: Metadata dinámica por producto
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return { title: 'Producto no encontrado' };
    }

    const priceFormatted = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(product.price);

    return {
        title: product.name,
        description: product.description || `${product.name} — ${priceFormatted}. Confección propia, calidad premium. Disponible en Wingx Store.`,
        openGraph: {
            title: `${product.name} — ${priceFormatted}`,
            description: product.description || `Descubre ${product.name} en Wingx Store. Confección propia, calidad premium.`,
            images: [
                {
                    url: product.imageUrl,
                    width: 800,
                    height: 1000,
                    alt: product.name,
                },
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${product.name} — ${priceFormatted}`,
            description: product.description || `Descubre ${product.name} en Wingx Store.`,
            images: [product.imageUrl],
        },
    };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    // Get related products
    const relatedProducts = await getRelatedProducts(product.category || 'Varios', id);

    // JSON-LD para datos estructurados de producto (Google Shopping / Rich Snippets)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.images && product.images.length > 0 ? product.images : [product.imageUrl],
        offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            seller: {
                '@type': 'Organization',
                name: 'Wingx Store',
            },
        },
        brand: {
            '@type': 'Brand',
            name: 'Wingx',
        },
        ...(product.category && { category: product.category }),
    };

    return (
        <div className="max-w-6xl mx-auto py-8 space-y-12">
            {/* JSON-LD para SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <ProductView
                product={product}
                relatedProductIds={relatedProducts.map(p => p.id)}
            />

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <RelatedProducts products={relatedProducts} />
            )}
        </div>
    );
}

