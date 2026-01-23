export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    images?: string[];
    category?: string;
    categories?: string[];
    sizes?: string[]; // e.g. ["S", "M", "L"]
    colors?: string[]; // e.g. ["Negro", "Blanco", "Azul"]
    gender?: 'Hombre' | 'Mujer' | 'Unisex';
    featured?: boolean;
}

export interface CartItem extends Product {
    cartItemId: string; // Unique ID for the cart line (product ID + variant args)
    selectedSize?: string;
    selectedColor?: string;
    quantity: number;
}
