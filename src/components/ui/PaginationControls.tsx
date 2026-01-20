"use client";

import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface PaginationControlsProps {
    totalItems: number;
    pageSize: number;
    currentPage: number;
}

export default function PaginationControls({
    totalItems,
    pageSize,
    currentPage,
}: PaginationControlsProps) {
    const totalPages = Math.ceil(totalItems / pageSize);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    if (totalPages <= 1) return null;

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    return (
        <div className="flex justify-center items-center gap-4 mt-12 mb-8">
            <Link
                href={createPageURL(currentPage - 1)}
                className={`glass-button p-2 rounded-full flex items-center justify-center transition-all ${currentPage <= 1 ? 'pointer-events-none opacity-50' : 'hover:scale-105'
                    }`}
                aria-disabled={currentPage <= 1}
            >
                <ChevronLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </Link>

            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Página {currentPage} de {totalPages}
            </span>

            <Link
                href={createPageURL(currentPage + 1)}
                className={`glass-button p-2 rounded-full flex items-center justify-center transition-all ${currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'hover:scale-105'
                    }`}
                aria-disabled={currentPage >= totalPages}
            >
                <ChevronRight className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </Link>
        </div>
    );
}
