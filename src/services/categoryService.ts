import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Categoria {
    id?: string;
    name: string;
    subcategorias: string[];
    icon?: string;
}

export async function getCategorias(): Promise<Categoria[]> {
    const snapshot = await getDocs(collection(db, 'categorias'));
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    } as Categoria));
}

export async function getCategoriasMap(): Promise<Record<string, string[]>> {
    const cats = await getCategorias();
    const map: Record<string, string[]> = {};
    for (const cat of cats) {
        map[cat.name] = cat.subcategorias;
    }
    return map;
}
