import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            {/* Orbe decorativo */}
            <div className="absolute w-64 h-64 rounded-full bg-neutral-100 dark:bg-neutral-900 blur-3xl opacity-50 pointer-events-none" />

            <div className="relative z-10 space-y-6">
                {/* Código de error */}
                <p className="text-[8rem] sm:text-[10rem] font-black leading-none tracking-tighter text-neutral-200 dark:text-neutral-800 select-none font-heading">
                    404
                </p>

                <div className="space-y-3 -mt-10 relative z-10">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white font-heading">
                        Página no encontrada
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto text-sm sm:text-base">
                        Lo sentimos, la página que buscas no existe o fue movida.
                        Puede que el producto ya no esté disponible.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-sm hover:opacity-80 active:scale-95 transition-all shadow-lg shadow-black/10 dark:shadow-white/10"
                    >
                        Volver al Inicio
                    </Link>
                    <Link
                        href="/catalogo"
                        className="px-6 py-3 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-full font-medium text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 active:scale-95 transition-all"
                    >
                        Ver Catálogo
                    </Link>
                </div>
            </div>
        </div>
    );
}
