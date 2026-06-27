'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Error capturado por error boundary:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            {/* Orbe decorativo */}
            <div className="absolute w-64 h-64 rounded-full bg-red-100 dark:bg-red-950/30 blur-3xl opacity-50 pointer-events-none" />

            <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center">
                    <svg
                        className="w-8 h-8 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                </div>

                <div className="space-y-3">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white font-heading">
                        Algo salió mal
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto text-sm sm:text-base">
                        Ocurrió un error inesperado. No te preocupes, nuestro equipo ya fue notificado.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                        onClick={reset}
                        className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-sm hover:opacity-80 active:scale-95 transition-all shadow-lg shadow-black/10 dark:shadow-white/10 cursor-pointer"
                    >
                        Intentar de nuevo
                    </button>
                    <a
                        href="/"
                        className="px-6 py-3 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-full font-medium text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 active:scale-95 transition-all"
                    >
                        Volver al Inicio
                    </a>
                </div>

                {error.digest && (
                    <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-4">
                        Código: {error.digest}
                    </p>
                )}
            </div>
        </div>
    );
}
