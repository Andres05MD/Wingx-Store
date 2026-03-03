'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, ...props }, ref) => {
        const [isFocused, setIsFocused] = React.useState(false);

        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className={cn(
                        "text-xs font-semibold uppercase tracking-wider ml-1 transition-colors duration-200",
                        error ? "text-red-500" : isFocused ? "text-neutral-900 dark:text-white" : "text-neutral-500 dark:text-neutral-400"
                    )}>
                        {label}
                    </label>
                )}
                <div className="relative group">
                    <div className={cn(
                        "absolute inset-0 bg-gradient-to-r from-neutral-200 to-neutral-200 dark:from-neutral-800 dark:to-neutral-800 rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none",
                        isFocused && !error ? "opacity-20 blur-sm" : ""
                    )} />

                    <div className={cn(
                        "relative bg-neutral-50 dark:bg-neutral-900 border rounded-xl transition-all duration-200 overflow-hidden",
                        error
                            ? "border-red-500 bg-red-50/50 dark:bg-red-900/10 focus-within:ring-2 focus-within:ring-red-200 dark:focus-within:ring-red-900/30"
                            : isFocused
                                ? "border-black dark:border-white bg-white dark:bg-black ring-4 ring-neutral-900/5 dark:ring-white/10"
                                : "border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20"
                    )}>
                        <textarea
                            className={cn(
                                "w-full bg-transparent px-4 py-3 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all font-medium resize-none min-h-[80px]",
                                className
                            )}
                            ref={ref}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            {...props}
                        />
                    </div>
                </div>
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
            </div>
        );
    }
);
Textarea.displayName = 'Textarea';

export { Textarea };
