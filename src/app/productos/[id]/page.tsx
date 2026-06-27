import { cache } from 'react';
import { getProductById, getRelatedProducts } from "@/services/productService";
import ProductView from "@/components/ProductView";
import { notFound } from "next/navigation";
import RelatedProducts from "@/components/RelatedProducts";
import type { Metadata } from "next";

// Revalidar cada 60 segundos (ISR)
export const revalidate = 60;

// React.cache() deduplica la llamada entre generateMetadata y ProductPage
const obtenerProducto = cache(async (id: string) => {
    return getProductById(id);
});

// SEO: Metadata dinámica por producto
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const product = await obtenerProducto(id);

    if (!product) {
        return { title: 'Producto no encontrado' };
    }

    const priceFormatted = new Intl.NumberFormat('es-VE', {
        style: 'currency',
        currency: 'USD',
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
    const product = await obtenerProducto(id);

    if (!product) {
        notFound();
    }

    // Obtener productos relacionados en paralelo (ya no depende de product gracias a cache)
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

