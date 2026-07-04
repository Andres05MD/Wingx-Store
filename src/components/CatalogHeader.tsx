interface CatalogHeaderProps {
    title?: string;
    subtitle?: string;
    resultCount?: number;
}

export default function CatalogHeader({
    title = "Catálogo",
    subtitle = "Explora nuestra colección completa de moda exclusiva.",
    resultCount,
}: CatalogHeaderProps) {
    return (
        <div className="mb-6 md:mb-10"
        >


            {/* Title Section */}
            <div className="flex flex-col gap-3 md:gap-4">
                <div className="flex items-end gap-4 md:gap-6">
                    <h1
                        className="font-heading font-extrabold tracking-tighter leading-none text-black dark:text-white"
                        style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
                    >
                        {title}
                    </h1>
                </div>


            </div>
        </div>
    );
}
