import { AnimatePresence, motion } from 'framer-motion';

interface FormErrorProps {
    error?: string;
}

export default function FormError({ error }: FormErrorProps) {
    return (
        <AnimatePresence mode="wait">
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -5, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -5, height: 0 }}
                    className="text-[11px] font-medium text-red-500 ml-1 flex items-center gap-1"
                >
                    <span className="inline-block w-1 h-1 rounded-full bg-red-500 mb-0.5" />
                    {error}
                </motion.p>
            )}
        </AnimatePresence>
    );
}
