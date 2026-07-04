'use client';

import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import IconWithBadge from '@/components/ui/IconWithBadge';

export default function CartIcon() {
    const { setIsCartOpen, totalItems } = useCart();

    return (
        <IconWithBadge
            icon={ShoppingCart}
            count={totalItems}
            onClick={() => setIsCartOpen(true)}
            aria-label="Abrir carrito"
            badgeColor="bg-black dark:bg-white text-white dark:text-black"
        />
    );
}
