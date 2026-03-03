"use client";

import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
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
    const searchParams = useSearchParams();
    const pathname = usePathname();

    if (totalPages <= 1) return null;

    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    // Generate page numbers to display
    const getPageNumbers = (): (number | 'ellipsis')[] => {
        const pages: (number | 'ellipsis')[] = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);

            if (currentPage > 3) pages.push('ellipsis');

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) pages.push(i);

            if (currentPage < totalPages - 2) pages.push('ellipsis');

            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex justify-center items-center gap-1.5 sm:gap-2 mt-10 md:mt-14 mb-6">
            {/* Previous */}
            <Link
                href={createPageURL(currentPage - 1)}
                className={`pagination-btn ${currentPage <= 1
                        ? 'pointer-events-none opacity-30'
                        : 'pagination-btn-inactive hover:scale-105'
                    }`}
                aria-disabled={currentPage <= 1}
                aria-label="Página anterior"
            >
                <ChevronLeft className="w-4 h-4" />
            </Link>

            {/* Page Numbers */}
            {pageNumbers.map((page, idx) => {
                if (page === 'ellipsis') {
                    return (
                        <span
                            key={`ellipsis-${idx}`}
                            className="w-10 h-10 flex items-center justify-center text-neutral-400 dark:text-neutral-500 text-sm select-none"
                        >
                            ···
                        </span>
                    );
                }

                return (
                    <Link
                        key={page}
                        href={createPageURL(page)}
                        className={`pagination-btn ${page === currentPage
                                ? 'pagination-btn-active'
                                : 'pagination-btn-inactive hover:scale-105'
                            }`}
                        aria-current={page === currentPage ? 'page' : undefined}
                        aria-label={`Ir a página ${page}`}
                    >
                        {page}
                    </Link>
                );
            })}

            {/* Next */}
            <Link
                href={createPageURL(currentPage + 1)}
                className={`pagination-btn ${currentPage >= totalPages
                        ? 'pointer-events-none opacity-30'
                        : 'pagination-btn-inactive hover:scale-105'
                    }`}
                aria-disabled={currentPage >= totalPages}
                aria-label="Página siguiente"
            >
                <ChevronRight className="w-4 h-4" />
            </Link>
        </div>
    );
}
