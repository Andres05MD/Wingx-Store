'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import FormError from '@/components/ui/FormError';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const DIAS_SEMANA = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

interface DatePickerProps {
  label?: string;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export function DatePicker({
  label,
  error,
  value,
  onChange,
  name,
  placeholder = 'Seleccionar fecha',
  disabled = false,
  minDate,
  maxDate,
}: DatePickerProps) {
  const [abierto, setAbierto] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [mesActual, setMesActual] = useState(() => {
    if (value) {
      const d = new Date(value + 'T12:00:00');
      return isNaN(d.getTime()) ? new Date() : d;
    }
    return new Date();
  });
  const contenedorRef = useRef<HTMLDivElement>(null);

  const fechaValue = value ? (() => {
    const d = new Date(value + 'T12:00:00');
    return isNaN(d.getTime()) ? null : d;
  })() : null;

  useEffect(() => {
    const manejarClickFuera = (e: MouseEvent) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target as Node)) {
        setAbierto(false);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', manejarClickFuera);
    return () => document.removeEventListener('mousedown', manejarClickFuera);
  }, []);

  useEffect(() => {
    if (abierto) {
      const manejarEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setAbierto(false);
          setIsFocused(false);
        }
      };
      document.addEventListener('keydown', manejarEscape);
      return () => document.removeEventListener('keydown', manejarEscape);
    }
  }, [abierto]);

  const diasEnMes = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const primerDiaSemana = (year: number, month: number) => new Date(year, month, 1).getDay();

  const formatoFecha = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dia}`;
  };

  const navegarMes = (delta: number) => {
    setMesActual(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const seleccionarDia = (dia: number) => {
    const nuevaFecha = new Date(mesActual.getFullYear(), mesActual.getMonth(), dia);
    onChange?.(formatoFecha(nuevaFecha));
    setAbierto(false);
    setIsFocused(false);
  };

  const fechaLimiteValida = (dia: number) => {
    const fecha = new Date(mesActual.getFullYear(), mesActual.getMonth(), dia);
    if (minDate && fecha < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) return false;
    if (maxDate && fecha > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) return false;
    const hoy = new Date();
    if (fecha > new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())) return false;
    return true;
  };

  const mes = mesActual.getMonth();
  const year = mesActual.getFullYear();
  const totalDias = diasEnMes(year, mes);
  const diaInicio = primerDiaSemana(year, mes);

  const infoLabel = fechaValue
    ? `${String(fechaValue.getDate()).padStart(2, '0')}/${String(fechaValue.getMonth() + 1).padStart(2, '0')}/${fechaValue.getFullYear()}`
    : '';

  return (
    <div className="w-full space-y-1.5" ref={contenedorRef}>
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
        <div className={cn(
          "absolute inset-0 bg-gradient-to-r from-neutral-200 to-neutral-200 dark:from-neutral-800 dark:to-neutral-800 rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none",
          isFocused && !error ? "opacity-20 blur-sm" : ""
        )} />

        <button
          type="button"
          disabled={disabled}
          onClick={() => { setAbierto(!abierto); setIsFocused(!abierto); }}
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
          <div className={cn(
            "pl-4 pr-3 transition-colors",
            isFocused ? "text-neutral-900 dark:text-white" : "text-neutral-400 dark:text-neutral-500"
          )}>
            <Calendar size={18} strokeWidth={2.5} />
          </div>

          <span className={cn(
            "flex-1 text-sm font-medium truncate",
            fechaValue ? "text-neutral-900 dark:text-white" : "text-neutral-400 dark:text-neutral-500"
          )}>
            {infoLabel || placeholder}
          </span>
        </button>

        <AnimatePresence>
          {abierto && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute z-50 w-full mt-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl shadow-black/10 dark:shadow-black/40 overflow-hidden"
            >
              <div className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <button
                    type="button"
                    onClick={() => navegarMes(-1)}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                    aria-label="Mes anterior"
                  >
                    <ChevronLeft size={16} strokeWidth={2} />
                  </button>
                  <span className="text-sm font-bold text-neutral-900 dark:text-white">
                    {MESES[mes]} {year}
                  </span>
                  <button
                    type="button"
                    onClick={() => navegarMes(1)}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                    aria-label="Mes siguiente"
                  >
                    <ChevronRight size={16} strokeWidth={2} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-0.5 mb-1">
                  {DIAS_SEMANA.map(d => (
                    <div key={d} className="text-center text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider py-1">
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-0.5">
                  {Array.from({ length: diaInicio }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: totalDias }, (_, i) => i + 1).map(dia => {
                    const esSeleccionado = fechaValue?.getDate() === dia && fechaValue?.getMonth() === mes && fechaValue?.getFullYear() === year;
                    const esValido = fechaLimiteValida(dia);
                    const esHoy = (() => {
                      const hoy = new Date();
                      return hoy.getDate() === dia && hoy.getMonth() === mes && hoy.getFullYear() === year;
                    })();

                    return (
                      <button
                        key={dia}
                        type="button"
                        disabled={!esValido}
                        onClick={() => seleccionarDia(dia)}
                        className={cn(
                          "w-full aspect-square flex items-center justify-center text-sm font-medium rounded-lg transition-all",
                          esSeleccionado
                            ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                            : esValido
                              ? "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                              : "text-neutral-300 dark:text-neutral-600 cursor-not-allowed",
                          esHoy && !esSeleccionado && "ring-1 ring-neutral-300 dark:ring-neutral-600"
                        )}
                      >
                        {dia}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FormError error={error} />
    </div>
  );
}
