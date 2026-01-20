'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Search } from 'lucide-react';
import { ModeToggle } from '@/components/ui/ModeToggle';
import imagekitLoader from '@/lib/imagekitLoader';
import CartIcon from './CartIcon';
import WishlistIcon from './WishlistIcon';
import UserMenu from './UserMenu';

export default function Header() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [allProducts, setAllProducts] = useState<{ id: string, name: string, category: string, imageUrl: string }[]>([]);
    const [searchResults, setSearchResults] = useState<{ id: string, name: string, category: string, imageUrl: string }[]>([]);
    const router = useRouter();
    const pathname = usePathname();
    const { theme, systemTheme } = useTheme();

    // Determine if dark mode is active
    const currentTheme = theme === 'system' ? systemTheme : theme;
    const isDarkMode = currentTheme === 'dark';

    // Logo URLs
    const lightModeLogo = 'https://ik.imagekit.io/xwym4oquc/resources/Isotipo.png';
    const darkModeLogo = 'https://ik.imagekit.io/xwym4oquc/resources/Isotipo(Invert).png';

    // Fetch basic product info for search index on mount
    useEffect(() => {
        const fetchSearchIndex = async () => {
            try {
                // Dynamic import to avoid server-side issues if any
                const { collection, getDocs, query, limit } = await import('firebase/firestore');
                const { db } = await import('@/lib/firebase');

                // Fetch valid products (maybe limit if too many, but for now fetch all for client search)
                // Optimized: Only fetch necessary fields if possible, but Firestore client Sdk fetches full docs.
                const q = query(collection(db, "productos"), limit(100));
                const snapshot = await getDocs(q);

                const products = snapshot.docs.map(doc => {
                    const data = doc.data();
                    // Handle image array or string
                    let img = data.imageUrl;
                    if (data.images && data.images.length > 0) img = data.images[0];

                    return {
                        id: doc.id,
                        name: data.name || '',
                        category: data.category || '',
                        imageUrl: img || ''
                    };
                });

                setAllProducts(products);
            } catch (err) {
                console.error("Error fetching search index", err);
            }
        };

        // Simple debounce or check if we already have data?
        // Just fetch once on mount.
        fetchSearchIndex();
    }, []);

    // Local filter logic
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchResults([]);
            return;
        }

        const lowerTerm = searchTerm.toLowerCase();
        const results = allProducts.filter(p =>
            p.name.toLowerCase().includes(lowerTerm) ||
            p.category.toLowerCase().includes(lowerTerm)
        ).slice(0, 5); // Limit to 5 suggestions

        setSearchResults(results);
    }, [searchTerm, allProducts]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/catalogo?search=${encodeURIComponent(searchTerm.trim())}`);
        } else {
            router.push('/catalogo');
        }
    };

    const isActive = (path: string) => {
        if (path === '/') {
            return pathname === '/';
        }
        return pathname?.startsWith(path);
    };

    return (
        <header className="sticky top-0 z-50 glass-panel border-b border-black/5 dark:border-white/5 animate-slide-down bg-white/80 dark:bg-black/80 backdrop-blur-md">
            <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Link href="/" className="flex items-center gap-3 group">
                        <Image
                            loader={imagekitLoader}
                            src={isDarkMode ? darkModeLogo : lightModeLogo}
                            alt="Wingx Logo"
                            width={48}
                            height={48}
                            className="w-12 h-12 object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="text-xl font-bold tracking-tight text-black dark:text-white group-hover:opacity-80 transition-opacity">
                            Wingx
                        </span>
                    </Link>
                </div>

                {/* Desktop Search Bar */}
                <div className="hidden md:flex flex-1 max-w-md mx-auto relative group">
                    <form onSubmit={handleSearch} className="relative w-full z-20">
                        <input
                            type="text"
                            placeholder="Buscar por categoría o prenda..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full py-2 pl-4 pr-10 text-sm text-black dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:bg-white dark:focus:bg-white/10 focus:border-black/20 dark:focus:border-white/20 transition-all shadow-sm focus:shadow-md"
                        />
                        <button
                            type="submit"
                            className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-neutral-500 hover:text-black dark:hover:text-white transition-colors bg-white/50 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full"
                        >
                            <Search className="w-4 h-4" />
                        </button>
                    </form>

                    {/* Live Search Results */}
                    <div className={`absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-black/5 dark:border-white/5 overflow-hidden transition-all duration-300 z-10 origin-top
                        ${isSearchFocused && searchTerm.trim().length > 0 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'}`}
                    >
                        {searchResults.length > 0 ? (
                            <div className="py-2">
                                <p className="px-4 py-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                    Resultados sugeridos
                                </p>
                                {searchResults.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/productos/${product.id}`}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <div className="relative w-10 h-12 bg-neutral-100 dark:bg-neutral-800 rounded overflow-hidden flex-shrink-0">
                                            <Image
                                                loader={imagekitLoader}
                                                src={product.imageUrl}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                sizes="40px"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-black dark:text-white line-clamp-1">{product.name}</p>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                {product.category}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                                <button
                                    onClick={(e) => handleSearch(e)}
                                    className="w-full text-center py-3 text-sm text-blue-600 dark:text-blue-400 font-medium hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors border-t border-neutral-100 dark:border-white/5"
                                >
                                    Ver todos los resultados
                                </button>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-neutral-500 dark:text-neutral-400">
                                <p>No encontramos resultados para "{searchTerm}"</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Desktop Navigation (Home + Theme) */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        href="/"
                        className={`text-sm font-medium transition-all relative group ${isActive('/')
                            ? 'text-black dark:text-white font-bold'
                            : 'text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white'
                            }`}
                    >
                        Inicio
                        {isActive('/') && (
                            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black dark:bg-white rounded-full" />
                        )}
                    </Link>
                    <Link
                        href="/catalogo"
                        className={`text-sm font-medium transition-all relative group ${isActive('/catalogo')
                            ? 'text-black dark:text-white font-bold'
                            : 'text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white'
                            }`}
                    >
                        Catálogo
                        {isActive('/catalogo') && (
                            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black dark:bg-white rounded-full" />
                        )}
                    </Link>
                    <WishlistIcon />
                    <CartIcon />
                    <UserMenu />
                    <ModeToggle />
                </nav>

                <div className="md:hidden flex items-center gap-2">
                    <UserMenu />
                    <ModeToggle />
                </div>
            </div>

        </header>
    );
}
