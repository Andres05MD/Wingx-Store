"use client";

import { motion } from "framer-motion";
import CatalogFilters from "@/components/StoreCatalogFilters";

interface AnimatedFiltersProps {
    categories: string[];
}

export default function AnimatedFilters({ categories }: AnimatedFiltersProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
        >
            <CatalogFilters categories={categories} />
        </motion.div>
    );
}
