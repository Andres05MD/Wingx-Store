'use client';

import { useWishlist } from '@/context/WishlistContext';
import { Heart } from 'lucide-react';
import IconWithBadge from '@/components/ui/IconWithBadge';

export default function WishlistIcon() {
    const { setIsWishlistOpen, wishlist } = useWishlist();

    return (
        <IconWithBadge
            icon={Heart}
            count={wishlist.length}
            onClick={() => setIsWishlistOpen(true)}
            aria-label="Abrir lista de deseos"
            badgeColor="bg-red-500 text-white"
        />
    );
}
