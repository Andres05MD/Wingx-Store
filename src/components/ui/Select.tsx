'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon, ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectProps {
    label?: string;
    error?: string;
    icon?: LucideIcon;
    placeholder?: string;
    opciones: SelectOption[];
    value?: string;
    onChange?: (value: string) => void;
    name?: string;
    disabled?: boolean;
}

export function Select({
    label,
    error,
    icon: Icon,
    placeholder = 'Seleccionar...',
    opciones,
    value,
    onChange,
    name,
    disabled = false,
}: SelectProps) {
    const [abierto, setAbierto] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const contenedorRef = React.useRef<HTMLDivElement>(null);

    const opcionSeleccionada = opciones.find(o => o.value === value);

    // Cerrar al hacer click fuera
    React.useEffect(() => {
        const manejarClickFuera = (e: MouseEvent) => {
            if (contenedorRef.current && !contenedorRef.current.contains(e.target as Node)) {
                setAbierto(false);
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', manejarClickFuera);
        return () => document.removeEventListener('mousedown', manejarClickFuera);
    }, []);

    // Cerrar con Escape
    React.useEffect(() => {
        const manejarEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setAbierto(false);
                setIsFocused(false);
            }
        };
        if (abierto) {
            document.addEventListener('keydown', manejarEscape);
        }
        return () => document.removeEventListener('keydown', manejarEscape);
    }, [abierto]);

    const seleccionar = (valor: string) => {
        onChange?.(valor);
        setAbierto(false);
        setIsFocused(false);
    };

    return (
        <div className="w-full space-y-1.5" ref={contenedorRef}>
            {/* Hidden input para react-hook-form */}
            {name && <input type="hidden" name={name} value={value || ''} />}

            {label && (
                <label className={cn(
                    "text-xs font-semibold uppercase tracking-wider ml-1 transition-colors duration-200",
                    error ? "text-red-500" : isFocused ? "text-neutral-900 dark:text-white" : "text-neutral-500 dark:text-neutral-400"
                )}>
                    {label}
                </label>
            )}

            <div className="relative">
                {/* Glow de fondo al enfocar */}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-r from-neutral-200 to-neutral-200 dark:from-neutral-800 dark:to-neutral-800 rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none",
                    isFocused && !error ? "opacity-20 blur-sm" : ""
                )} />

                {/* Botón Trigger */}
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                        setAbierto(!abierto);
                        setIsFocused(!abierto);
                    }}
                    className={cn(
                        "relative w-full flex items-center h-12 bg-neutral-50 dark:bg-neutral-900 border rounded-xl transition-all duration-200 overflow-hidden cursor-pointer text-left",
                        error
                            ? "border-red-500 bg-red-50/50 dark:bg-red-900/10"
                            : isFocused
                                ? "border-black dark:border-white bg-white dark:bg-black ring-4 ring-neutral-900/5 dark:ring-white/10"
                                : "border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {Icon && (
                        <div className={cn(
                            "pl-4 pr-3 transition-colors",
                            isFocused ? "text-neutral-900 dark:text-white" : "text-neutral-400 dark:text-neutral-500"
                        )}>
                            <Icon size={18} strokeWidth={2.5} />
                        </div>
                    )}

                    <span className={cn(
                        "flex-1 text-sm font-medium truncate",
                        Icon ? "pl-0 pr-4" : "px-4",
                        opcionSeleccionada
                            ? "text-neutral-900 dark:text-white"
                            : "text-neutral-400 dark:text-neutral-500"
                    )}>
                        {opcionSeleccionada?.label || placeholder}
                    </span>

                    <div className="pr-4 pl-2">
                        <motion.div
                            animate={{ rotate: abierto ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronDown
                                size={18}
                                strokeWidth={2}
                                className={cn(
                                    "transition-colors",
                                    isFocused ? "text-neutral-900 dark:text-white" : "text-neutral-400 dark:text-neutral-500"
                                )}
                            />
                        </motion.div>
                    </div>
                </button>

                {/* Panel Dropdown */}
                <AnimatePresence>
                    {abierto && (
                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.96 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            className="absolute z-50 w-full mt-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl shadow-black/10 dark:shadow-black/40 overflow-hidden"
                        >
                            <div className="max-h-[200px] overflow-y-auto py-1.5">
                                {opciones.map((opcion) => {
                                    const seleccionada = opcion.value === value;
                                    return (
                                        <button
                                            key={opcion.value}
                                            type="button"
                                            onClick={() => seleccionar(opcion.value)}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-left transition-colors cursor-pointer",
                                                seleccionada
                                                    ? "bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white"
                                                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-black dark:hover:text-white"
                                            )}
                                        >
                                            <span className="flex-1 truncate">{opcion.label}</span>
                                            {seleccionada && (
                                                <Check size={16} strokeWidth={2.5} className="text-black dark:text-white shrink-0" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Error animado */}
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
