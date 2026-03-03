import type { MetadataRoute } from 'next';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wingx-store.vercel.app';

    // Rutas estáticas
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/catalogo`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
    ];

    // Rutas dinámicas de productos
    try {
        const productsRef = collection(db, 'productos');
        const snapshot = await getDocs(productsRef);

        const productRoutes: MetadataRoute.Sitemap = snapshot.docs.map((doc) => ({
            url: `${baseUrl}/productos/${doc.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));

        return [...staticRoutes, ...productRoutes];
    } catch (error) {
        console.error('Error generando sitemap:', error);
        return staticRoutes;
    }
}
