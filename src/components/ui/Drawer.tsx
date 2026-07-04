'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, LucideIcon } from 'lucide-react';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    icon: LucideIcon;
    count?: number;
    children: ReactNode;
}

export default function Drawer({ isOpen, onClose, title, icon: Icon, count, children }: DrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const isBrowserNavigation = useRef(false);

    useEffect(() => {
        if (!isOpen) return;

        isBrowserNavigation.current = false;
        if (drawerRef.current) {
            drawerRef.current.style.display = '';
            drawerRef.current.style.opacity = '';
        }
        if (backdropRef.current) {
            backdropRef.current.style.display = '';
            backdropRef.current.style.opacity = '';
        }

        window.history.pushState({ drawerOpen: true }, '');

        const handlePopState = () => {
            isBrowserNavigation.current = true;
            if (drawerRef.current) drawerRef.current.style.display = 'none';
            if (backdropRef.current) backdropRef.current.style.display = 'none';
            onClose();
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [isOpen, onClose]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
                window.history.back();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleClose = () => {
        window.history.back();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        key="backdrop"
                        ref={backdropRef}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                        aria-hidden="true"
                    />
                    <motion.div
                        key="drawer"
                        ref={drawerRef}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={isBrowserNavigation.current ? { opacity: 0, transition: { duration: 0 } } : { x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white dark:bg-neutral-900 shadow-2xl z-[60] flex flex-col border-l border-neutral-200 dark:border-neutral-800"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="bg-black dark:bg-white text-white dark:text-black p-2 rounded-lg">
                                    <Icon size={20} />
                                </div>
                                <h2 className="text-xl font-bold font-heading">{title}{count !== undefined ? ` (${count})` : ''}</h2>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X size={24} className="text-neutral-500" />
                            </button>
                        </div>

                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
