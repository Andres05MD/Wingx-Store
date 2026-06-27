'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="es">
            <body className="bg-white dark:bg-black text-black dark:text-white font-sans">
                <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
                    <div className="space-y-6">
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
                            <h1 className="text-2xl font-bold tracking-tight">
                                Error crítico
                            </h1>
                            <p className="text-neutral-500 max-w-md mx-auto text-sm">
                                La aplicación encontró un error grave. Por favor, intenta recargar la página.
                            </p>
                        </div>

                        <button
                            onClick={reset}
                            className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-sm hover:opacity-80 active:scale-95 transition-all cursor-pointer"
                        >
                            Recargar página
                        </button>

                        {error.digest && (
                            <p className="text-xs text-neutral-400 mt-4">
                                Referencia: {error.digest}
                            </p>
                        )}
                    </div>
                </div>
            </body>
        </html>
    );
}
