'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface RendimientoContextType {
    esBajoRendimiento: boolean;
    cargandoDeteccion: boolean;
}

const RendimientoContext = createContext<RendimientoContextType | undefined>(undefined);

export function RendimientoProvider({ children }: { children: ReactNode }) {
    const [esBajoRendimiento, setEsBajoRendimiento] = useState(false);
    const [cargandoDeteccion, setCargandoDeteccion] = useState(true);

    useEffect(() => {
        const detectarRendimiento = () => {
            try {
                // 1. Detección por memoria (Experimental pero útil)
                // @tsx-ignore m.deviceMemory is not in standard TS types yet
                const memoria = (navigator as any).deviceMemory;
                
                // 2. Detección por núcleos de CPU
                const nucleos = navigator.hardwareConcurrency || 4;

                // 3. Detección por preferencia de movimiento reducido (sistema operativo)
                const prefiereMovimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

                // 4. Heurística básica: Si tiene < 4GB de RAM o < 4 núcleos, o prefiere movimiento reducido
                // o es un móvil antiguo (detectado por resolución y userAgent simple)
                const esMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                const pantallaPequena = window.innerWidth < 768;

                let bajoRendimiento = false;

                // Lógica de decisión
                if (memoria && memoria < 4) bajoRendimiento = true;
                if (nucleos < 4) bajoRendimiento = true;
                if (prefiereMovimientoReducido) bajoRendimiento = true;
                
                // Si es móvil y tiene pocos recursos, definitivamente bajo rendimiento
                if (esMovil && (nucleos <= 2 || (memoria && memoria <= 2))) bajoRendimiento = true;

                setEsBajoRendimiento(bajoRendimiento);
                
                // Inyectar atributo global para CSS
                if (typeof document !== 'undefined') {
                    document.documentElement.dataset.bajoRendimiento = bajoRendimiento ? 'true' : 'false';
                }

                if (bajoRendimiento) {
                    console.log('🚀 Wingx: Modo bajo rendimiento detectado automáticamente.');
                }
            } catch (error) {
                console.error('Error detectando rendimiento:', error);
            } finally {
                setCargandoDeteccion(false);
            }
        };

        detectarRendimiento();
    }, []);

    return (
        <RendimientoContext.Provider value={{ esBajoRendimiento, cargandoDeteccion }}>
            {children}
        </RendimientoContext.Provider>
    );
}

export function useRendimiento() {
    const context = useContext(RendimientoContext);
    if (context === undefined) {
        throw new Error('useRendimiento debe ser usado dentro de un RendimientoProvider');
    }
    return context;
}
