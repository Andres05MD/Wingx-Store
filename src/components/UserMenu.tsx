'use client';

import { useAuth } from '@/context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserMenu() {
    const { user, signInWithGoogle, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    if (!user) {
        return (
            <Link
                href={`/login?redirect=${encodeURIComponent(pathname)}`}
                className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            >
                <UserIcon size={16} />
                <span className="hidden sm:inline">Ingresar</span>
            </Link>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-9 h-9 rounded-full overflow-hidden border border-black dark:border-white"
            >
                {user.photoURL ? (
                    <Image
                        src={user.photoURL}
                        alt={user.displayName || 'Usuario'}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-black dark:bg-white flex items-center justify-center">
                        <span className="text-sm font-bold text-white dark:text-black">
                            {user.displayName
                                ? user.displayName.charAt(0).toUpperCase()
                                : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}
                        </span>
                    </div>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-30"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-100 dark:border-white/10 z-40 overflow-hidden"
                        >
                            <div className="p-4 border-b border-neutral-100 dark:border-white/5">
                                <p className="font-semibold text-sm text-black dark:text-white truncate">
                                    {user.displayName}
                                </p>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                                    {user.email}
                                </p>
                            </div>
                            <div className="p-1">
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-neutral-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    <LogOut size={16} />
                                    Cerrar sesión
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
