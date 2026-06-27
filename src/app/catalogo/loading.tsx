export default function CatalogLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header skeleton */}
            <div className="text-center py-10 space-y-4">
                <div className="h-10 w-48 mx-auto rounded-lg bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-4 w-72 mx-auto rounded bg-neutral-100 dark:bg-neutral-850" />
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                {/* Sidebar skeleton */}
                <aside className="w-full md:w-56 lg:w-60 shrink-0">
                    <div className="space-y-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800" />
                        ))}
                    </div>
                </aside>

                {/* Product grid skeleton */}
                <main className="flex-1 min-w-0">
                    <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="rounded-xl overflow-hidden border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                                <div className="aspect-[4/5] bg-neutral-200 dark:bg-neutral-800 animate-shimmer" />
                                <div className="p-3 space-y-2">
                                    <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
                                    <div className="h-3 w-1/2 rounded bg-neutral-100 dark:bg-neutral-850" />
                                    <div className="h-5 w-1/3 rounded bg-neutral-200 dark:bg-neutral-800" />
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
