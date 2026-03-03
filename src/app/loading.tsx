export default function Loading() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Banner skeleton */}
            <div className="w-full h-[300px] md:h-[500px] rounded-[2rem] bg-neutral-200 dark:bg-neutral-800 animate-shimmer" />

            {/* Section title skeleton */}
            <div className="flex items-center gap-2 px-4">
                <div className="w-1 h-6 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <div className="h-6 w-48 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
            </div>

            {/* Product grid skeleton */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4">
                {Array.from({ length: 8 }).map((_, i) => (
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
        </div>
    );
}
