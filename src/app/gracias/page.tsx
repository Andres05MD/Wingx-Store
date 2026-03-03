'use client';

import { Suspense, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    CheckCircle2,
    Clock,
    Mail,
    ShoppingBag,
    Home,
    Sparkles,
    Loader2,
    XCircle,
    PartyPopper,
    AlertCircle,
    Scissors
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { StoreOrder } from '@/types/order';
import confetti from 'canvas-confetti';

// Componente que usa useSearchParams (debe estar dentro de Suspense)
function GraciasContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [order, setOrder] = useState<StoreOrder | null>(null);
    const [status, setStatus] = useState<'pending_verification' | 'paid' | 'rejected' | 'loading'>('loading');

    useEffect(() => {
        if (!orderId) {
            setStatus('pending_verification');
            return;
        }

        // Escuchar cambios en tiempo real
        const unsubscribe = onSnapshot(
            doc(db, 'orders', orderId),
            (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data() as StoreOrder;
                    setOrder({ ...data, id: docSnapshot.id });
                    setStatus(data.status as any);

                    // Si el pago fue verificado, lanzar confetti
                    if (data.status === 'paid') {
                        launchConfetti();
                    }
                } else {
                    setStatus('pending_verification');
                }
            },
            (error) => {
                console.error('Error al escuchar orden:', error);
                setStatus('pending_verification');
            }
        );

        return () => unsubscribe();
    }, [orderId]);

    // Función para lanzar confetti (B&W + dorado sutil)
    const launchConfetti = () => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                clearInterval(interval);
                return;
            }

            confetti({
                particleCount: 3,
                angle: randomInRange(55, 125),
                spread: randomInRange(50, 70),
                origin: { x: randomInRange(0.1, 0.9), y: 0.6 },
                colors: ['#000000', '#404040', '#808080', '#c0c0c0', '#ffffff']
            });
        }, 50);
    };

    // Renderizar contenido según el estado
    const renderStatusContent = () => {
        if (status === 'loading') {
            return (
                <>
                    <div className="w-24 h-24 mx-auto mb-6 relative">
                        <div className="w-full h-full bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center animate-pulse">
                            <Loader2 className="w-12 h-12 text-neutral-400 animate-spin" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
                        Cargando estado...
                    </h1>
                </>
            );
        }

        if (status === 'paid') {
            return (
                <>
                    {/* Icon Success Animation */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="w-24 h-24 mx-auto mb-6 relative"
                    >
                        <div className="absolute inset-0 bg-neutral-900 dark:bg-white rounded-full blur-xl opacity-30" />
                        <div className="relative w-full h-full bg-neutral-900 dark:bg-white rounded-full flex items-center justify-center shadow-2xl shadow-black/20 dark:shadow-white/10">
                            <CheckCircle2 className="w-12 h-12 text-white dark:text-black" />
                        </div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="absolute -top-2 -right-2"
                        >
                            <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center border border-neutral-200 dark:border-neutral-700">
                                <PartyPopper className="w-4 h-4 text-neutral-900 dark:text-white" />
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-3"
                    >
                        ¡Pago Verificado!
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-neutral-500 dark:text-neutral-400 text-lg mb-8"
                    >
                        Tu pago ha sido confirmado exitosamente
                    </motion.p>

                    {/* Success Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-neutral-900 dark:bg-white rounded-2xl p-6 mb-8"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-white/10 dark:bg-black/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Scissors className="w-5 h-5 text-white dark:text-black" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-white dark:text-black mb-1">
                                    ¡Pedido en Confección!
                                </h3>
                                <p className="text-sm text-neutral-400 dark:text-neutral-600 leading-relaxed">
                                    Hemos iniciado la preparación de tus prendas exclusivas. Tiempo estimado:
                                    <span className="font-semibold text-white dark:text-black"> 5 a 7 días hábiles</span>. Te contactaremos
                                    cuando esté listo.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            );
        }

        if (status === 'rejected') {
            return (
                <>
                    {/* Icon Error */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="w-24 h-24 mx-auto mb-6 relative"
                    >
                        <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-30" />
                        <div className="relative w-full h-full bg-red-500 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/20">
                            <XCircle className="w-12 h-12 text-white" />
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-3"
                    >
                        Pago No Verificado
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-neutral-500 dark:text-neutral-400 text-lg mb-8"
                    >
                        No pudimos confirmar tu transferencia
                    </motion.p>

                    {/* Error Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-6 mb-8"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                <XCircle className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-red-700 dark:text-red-300 mb-1">
                                    Verifica tus datos
                                </h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    Puede que los datos de la transferencia no coincidan. Por favor
                                    contáctanos por WhatsApp para resolver este inconveniente.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            );
        }

        // Estado pendiente (por defecto)
        return (
            <>
                {/* Icon Success Animation */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-5 sm:mb-6 relative"
                >
                    <div className="absolute inset-0 bg-neutral-900 dark:bg-white rounded-full blur-xl opacity-30" />
                    <div className="relative w-full h-full bg-neutral-900 dark:bg-white rounded-full flex items-center justify-center shadow-2xl shadow-black/20 dark:shadow-white/10">
                        <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-white dark:text-black" />
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="absolute -top-2 -right-2"
                    >
                        <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center border border-neutral-200 dark:border-neutral-700">
                            <Sparkles className="w-4 h-4 text-neutral-900 dark:text-white" />
                        </div>
                    </motion.div>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-2 sm:mb-3"
                >
                    ¡Gracias por tu compra!
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm sm:text-lg text-neutral-500 dark:text-neutral-400 mb-6 sm:mb-8"
                >
                    Tu pedido ha sido registrado exitosamente
                </motion.p>

                {/* Status Card - Verificando */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl p-4 sm:p-6 mb-5 sm:mb-6"
                >
                    <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 bg-neutral-900 dark:bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                            <Clock className="w-5 h-5 text-white dark:text-black animate-pulse" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-neutral-900 dark:text-white mb-1">
                                Verificando tu Transferencia
                            </h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                Estamos revisando tu pago móvil. Esta página se actualizará
                                automáticamente cuando sea verificado.
                            </p>
                            <div className="mt-3 flex items-center gap-2 text-neutral-900 dark:text-white">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                    Tiempo estimado: 5-10 min
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Info Box */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 sm:p-4 mb-6 sm:mb-8 text-left flex items-start gap-3"
                >
                    <AlertCircle className="w-4 h-4 text-neutral-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        <span className="font-bold text-neutral-900 dark:text-white">Importante:</span> Conserva tu número de referencia
                        del pago móvil por si necesitas comunicarte con nosotros.
                    </p>
                </motion.div>
            </>
        );
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neutral-200/50 dark:bg-neutral-800/30 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neutral-300/30 dark:bg-neutral-700/20 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative z-10 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-12 pb-24 sm:pb-12 max-w-lg w-full text-center shadow-2xl shadow-neutral-200/50 dark:shadow-black/30"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={status}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderStatusContent()}
                    </motion.div>
                </AnimatePresence>

                {/* Order ID */}
                {orderId && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                        className="bg-neutral-100 dark:bg-black/40 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 mb-6"
                    >
                        <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                            Número de Orden
                        </p>
                        <p className="font-mono text-lg text-neutral-900 dark:text-white font-bold">
                            #{orderId.slice(0, 8).toUpperCase()}
                        </p>
                    </motion.div>
                )}

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col sm:flex-row gap-3"
                >
                    <Link
                        href="/"
                        className="flex-1 py-3.5 px-6 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black font-bold
                                 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-black/10 dark:shadow-white/5 active:scale-[0.98] cursor-pointer"
                    >
                        <Home className="w-5 h-5" />
                        Ir al Inicio
                    </Link>
                    <Link
                        href="/catalogo"
                        className="flex-1 py-3.5 px-6 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-white font-semibold
                                 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        Seguir Comprando
                    </Link>
                </motion.div>

                {/* Footer Note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 text-xs text-neutral-500"
                >
                    ¿Tienes alguna pregunta? Contáctanos por{' '}
                    <a
                        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-900 dark:text-white hover:underline font-semibold"
                    >
                        WhatsApp
                    </a>
                </motion.p>
            </motion.div>
        </div>
    );
}

// Loading fallback para Suspense
function GraciasLoading() {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-4">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-neutral-400 animate-spin" />
                <p className="text-neutral-500">Cargando...</p>
            </div>
        </div>
    );
}

// Componente principal con Suspense
export default function GraciasPage() {
    return (
        <Suspense fallback={<GraciasLoading />}>
            <GraciasContent />
        </Suspense>
    );
}
