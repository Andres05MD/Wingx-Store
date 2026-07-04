export default function InfiniteMarquee({ items: customItems }: { items?: string[] }) {
    const defaultItems = [
        "ENTREGAS SEGURAS",
        "•",
        "CALIDAD PREMIUM GARANTIZADA",
        "•",
        "DISEÑO EXCLUSIVO WINGX",
        "•",
        "NUEVA COLECCIÓN DISPONIBLE",
        "•",
        "COMPRA PROTEGIDA",
        "•"
    ];

    const items = customItems || defaultItems;

    return (
        <div className="w-full bg-neutral-100/90 dark:bg-neutral-900/90 text-neutral-500 dark:text-neutral-400 py-1.5 md:py-3 overflow-hidden border-y border-neutral-200 dark:border-neutral-800">
            <div className="flex whitespace-nowrap overflow-hidden">
                <div className="flex gap-4 md:gap-8 items-center animate-marquee">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex gap-4 md:gap-8 items-center flex-shrink-0">
                            {items.map((item, idx) => (
                                <span key={idx} className="text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase">
                                    {item}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
