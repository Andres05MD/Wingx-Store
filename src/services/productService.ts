import { collection, getDocs, doc, getDoc, query, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types';

const DEFAULT_IMAGE = '/no-image.svg';

/**
 * Normaliza las categorías de un documento de producto de Firestore
 */
function normalizeCategories(data: Record<string, unknown>): string[] {
    if (data.categories && Array.isArray(data.categories)) {
        return data.categories as string[];
    }
    if (data.category && typeof data.category === 'string') {
        return [data.category];
    }
    return ['Sin Categoría'];
}

/**
 * Convierte un documento de Firestore a un objeto Product tipado
 */
function docToProduct(id: string, data: Record<string, unknown>): Product {
    const categories = normalizeCategories(data);

    return {
        id,
        name: (data.name as string) || 'Sin Nombre',
        price: typeof data.price === 'number' ? data.price : 0,
        description: (data.description as string) || '',
        imageUrl: (data.imageUrl as string) || DEFAULT_IMAGE,
        category: categories[0] || 'Varios',
        categories,
        gender: (data.gender as Product['gender']) || 'Unisex',
        ...data,
    } as Product;
}

/**
 * Obtiene todos los productos de Firestore
 */
export async function getAllProducts(): Promise<Product[]> {
    try {
        const productsRef = collection(db, 'productos');
        const snapshot = await getDocs(productsRef);

        if (snapshot.empty) return [];

        return snapshot.docs.map((doc) => docToProduct(doc.id, doc.data()));
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

/**
 * Obtiene solo los productos destacados (featured)
 */
export async function getFeaturedProducts(): Promise<Product[]> {
    const allProducts = await getAllProducts();
    return allProducts.filter((p) => p.featured === true);
}

/**
 * Obtiene un producto individual por su ID
 */
export async function getProductById(id: string): Promise<Product | null> {
    try {
        const docRef = doc(db, 'productos', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docToProduct(docSnap.id, docSnap.data());
        }
        return null;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

/**
 * Obtiene productos relacionados por categoría (excluyendo el producto actual)
 */
export async function getRelatedProducts(
    category: string,
    currentProductId: string,
    maxResults: number = 4
): Promise<Product[]> {
    try {
        const productsRef = collection(db, 'productos');
        const q = query(
            productsRef,
            where('category', '==', category),
            limit(maxResults + 1)
        );

        const querySnapshot = await getDocs(q);
        const products: Product[] = [];

        querySnapshot.forEach((docSnap) => {
            if (docSnap.id !== currentProductId) {
                products.push(docToProduct(docSnap.id, docSnap.data()));
            }
        });

        return products.slice(0, maxResults);
    } catch (error) {
        console.error('Error fetching related products:', error);
        return [];
    }
}
