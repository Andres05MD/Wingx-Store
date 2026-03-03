'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
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
    const [scrolled, setScrolled] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // Logo URLs
    const lightModeLogo = 'https://ik.imagekit.io/xwym4oquc/resources/Isotipo.png';
    const darkModeLogo = 'https://ik.imagekit.io/xwym4oquc/resources/Isotipo(Invert).png';

    // Scroll detection for visual change
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch basic product info for search index on mount
    useEffect(() => {
        const fetchSearchIndex = async () => {
            try {
                const { collection, getDocs, query, limit } = await import('firebase/firestore');
                const { db } = await import('@/lib/firebase');

                const q = query(collection(db, "productos"), limit(100));
                const snapshot = await getDocs(q);

                const products = snapshot.docs.map(doc => {
                    const data = doc.data();
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
        ).slice(0, 5);

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
        <header className={`sticky top-0 z-50 transition-all duration-700 pointer-events-none ${scrolled
            ? 'py-3'
            : 'py-0'
            }`}>
            <div className={`mx-auto pointer-events-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${scrolled
                ? 'w-[96%] max-w-7xl rounded-full bg-white/80 dark:bg-black/70 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.03)] border border-black/[0.04] dark:border-white/[0.06] h-14'
                : 'w-full bg-white/60 dark:bg-black/60 backdrop-blur-xl border-b border-black/[0.04] dark:border-white/[0.06] h-16 rounded-none'
                }`}>

                {/* Textura de ruido sutil opcional */}
                <div className={`absolute inset-0 bg-noise opacity-[0.015] dark:opacity-[0.03] pointer-events-none transition-opacity ${scrolled ? 'rounded-full' : ''}`} />

                <div className="relative px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
                    {/* Logo */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Link href="/" className="flex items-center gap-3 group">
                            <Image
                                loader={imagekitLoader}
                                src={lightModeLogo}
                                alt="Wingx Logo"
                                width={48}
                                height={48}
                                className={`object-contain group-hover:scale-105 transition-transform duration-300 dark:hidden ${scrolled ? 'w-8 h-8' : 'w-10 h-10'}`}
                            />
                            <Image
                                loader={imagekitLoader}
                                src={darkModeLogo}
                                alt="Wingx Logo"
                                width={48}
                                height={48}
                                className={`object-contain group-hover:scale-105 transition-transform duration-300 hidden dark:block ${scrolled ? 'w-8 h-8' : 'w-10 h-10'}`}
                            />
                            <span className={`font-black tracking-tighter text-black dark:text-white group-hover:opacity-80 transition-all duration-300 font-heading ${scrolled ? 'text-lg' : 'text-xl'}`}>
                                Wingx
                            </span>
                        </Link>

                        {/* Separador decorativo */}
                        <div className="hidden md:block w-px h-6 bg-gradient-to-b from-transparent via-black/10 to-transparent dark:via-white/10 ml-3" />
                    </div>

                    {/* Desktop Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-sm mx-auto relative group">
                        <form onSubmit={handleSearch} className="relative w-full z-20">
                            <input
                                type="text"
                                placeholder="Buscar por categoría o prenda..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                                className={`w-full bg-black/[0.02] dark:bg-white/[0.02] backdrop-blur-md border border-transparent hover:border-black/[0.1] dark:hover:border-white/[0.1] rounded-full pl-5 pr-12 text-sm text-black dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:bg-white/90 dark:focus:bg-neutral-900/90 focus:border-black/20 dark:focus:border-white/20 transition-all duration-300 focus:shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:focus:shadow-[0_0_15px_rgba(255,255,255,0.05)] ${scrolled ? 'py-1.5' : 'py-2.5'}`}
                            />
                            <button
                                type="submit"
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-black dark:hover:text-white transition-all hover:scale-110 cursor-pointer"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                        </form>

                        {/* Live Search Results */}
                        <div className={`absolute top-[calc(100%+12px)] left-0 right-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-3xl border border-black/[0.06] dark:border-white/[0.08] rounded-2xl overflow-hidden transition-all duration-500 origin-top shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(255,255,255,0.05)]
                            ${isSearchFocused && searchTerm.trim().length > 0 ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none invisible'}`}
                        >
                            {searchResults.length > 0 ? (
                                <div className="py-2">
                                    <p className="px-5 py-2.5 text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em]">
                                        Sugerencias
                                    </p>
                                    {searchResults.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/productos/${product.id}`}
                                            className="flex items-center gap-3 px-5 py-3 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors group/item"
                                        >
                                            <div className="relative w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden flex-shrink-0 group-hover/item:scale-105 transition-transform">
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
                                                <p className="text-sm font-medium text-black dark:text-white line-clamp-1 group-hover/item:text-neutral-700 dark:group-hover/item:text-neutral-300 transition-colors">{product.name}</p>
                                                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                                                    {product.category}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                    <div className="px-3 pt-2">
                                        <button
                                            onClick={(e) => handleSearch(e)}
                                            className="w-full text-center py-2.5 text-xs text-black dark:text-white font-medium bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/20 transition-colors rounded-xl cursor-pointer"
                                        >
                                            Ver todos los resultados →
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 text-center text-neutral-400 dark:text-neutral-500 text-sm">
                                    <Search className="w-8 h-8 opacity-20 mx-auto mb-3" />
                                    <p>No encontramos resultados para <br /><span className="text-black dark:text-white font-medium">&quot;{searchTerm}&quot;</span></p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1.5">
                        {[
                            { href: '/', label: 'Inicio' },
                            { href: '/catalogo', label: 'Catálogo' },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full group ${isActive(link.href)
                                    ? 'text-black dark:text-white bg-black/[0.04] dark:bg-white/[0.08]'
                                    : 'text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Separador */}
                        <div className="w-px h-5 bg-gradient-to-b from-transparent via-black/10 to-transparent dark:via-white/10 mx-2" />

                        <div className="flex items-center gap-1 bg-black/[0.02] dark:bg-white/[0.02] p-1 rounded-full border border-black/[0.03] dark:border-white/[0.03]">
                            <WishlistIcon />
                            <CartIcon />
                            <UserMenu />
                            <ModeToggle />
                        </div>
                    </nav>

                    <div className="md:hidden flex items-center gap-2">
                        <UserMenu />
                        <ModeToggle />
                    </div>
                </div>
            </div>
        </header>
    );
}
