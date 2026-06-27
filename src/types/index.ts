export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    images?: string[];
    category?: string;
    categories?: string[];
    sizes?: string[]; // ej. ["S", "M", "L"]
    colors?: string[]; // ej. ["Negro", "Blanco", "Azul"]
    customColorMap?: Record<string, string>; // Colores personalizados: { nombreColor: valorHex }
    gender?: 'Hombre' | 'Mujer' | 'Unisex';
    featured?: boolean;
}

export interface CartItem extends Product {
    cartItemId: string; // ID único para la línea del carrito (ID del producto + argumentos de variante)
    selectedSize?: string;
    selectedColor?: string;
    quantity: number;
}
