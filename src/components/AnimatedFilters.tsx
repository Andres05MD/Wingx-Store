import CatalogFilters from "@/components/StoreCatalogFilters";

interface AnimatedFiltersProps {
    categories: string[];
}

export default function AnimatedFilters({ categories }: AnimatedFiltersProps) {
    return <CatalogFilters categories={categories} />;
}
