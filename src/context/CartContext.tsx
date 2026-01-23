'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Product, CartItem } from '@/types';
import { toast } from 'sonner';

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, selectedSize?: string, selectedColor?: string) => void;
    removeFromCart: (cartItemId: string) => void;
    updateQuantity: (cartItemId: string, change: number) => void;
    clearCart: () => void;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('wingx_cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (error) {
                console.error('Error parsing cart from localStorage:', error);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever items change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('wingx_cart', JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addToCart = (product: Product, selectedSize?: string, selectedColor?: string) => {
        // Validation: if product needs size, ensure it's selected.
        // However, this validation is better handled in the UI. 
        // Here we assume valid input or optional size.

        const cartItemId = `${product.id}-${selectedSize || 'nosize'}-${selectedColor || 'nocolor'}`;
        const existingItem = items.find((item) => item.cartItemId === cartItemId);

        if (existingItem) {
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.cartItemId === cartItemId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
            toast.success('Cantidad actualizada en el carrito');
        } else {
            setItems((prevItems) => [
                ...prevItems,
                {
                    ...product,
                    cartItemId,
                    selectedSize,
                    selectedColor,
                    quantity: 1,
                },
            ]);
            toast.success('Producto agregado al carrito');
        }

        setIsCartOpen(true);
    };

    const removeFromCart = (cartItemId: string) => {
        setItems((prevItems) => prevItems.filter((item) => item.cartItemId !== cartItemId));
        toast.info('Producto eliminado del carrito');
    };

    const updateQuantity = (cartItemId: string, change: number) => {
        setItems((prevItems) =>
            prevItems.map((item) => {
                if (item.cartItemId === cartItemId) {
                    const newQuantity = Math.max(1, item.quantity + change);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
        );
    };

    const clearCart = () => {
        setItems([]);
        toast.info('Carrito vaciado');
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                isCartOpen,
                setIsCartOpen,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
