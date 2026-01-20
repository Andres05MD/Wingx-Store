import { doc, getDoc, collection, query, where, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProductView from "@/components/ProductView";
import { Product } from "@/types";
import { notFound } from "next/navigation";
import RelatedProducts from "@/components/RelatedProducts";

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
                imageUrl: data.imageUrl || 'https://via.placeholder.com/400x500?text=No+Image',
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
                    imageUrl: data.imageUrl || 'https://via.placeholder.com/400x500?text=No+Image',
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

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    // Get related products
    const relatedProducts = await getRelatedProducts(product.category || 'Varios', id);

    return (
        <div className="max-w-6xl mx-auto py-8 space-y-12">
            <ProductView product={product} />

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <RelatedProducts products={relatedProducts} />
            )}
        </div>
    );
}
