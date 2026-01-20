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
    PartyPopper
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

    // Función para lanzar confetti
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
                colors: ['#10b981', '#14b8a6', '#22c55e', '#fbbf24', '#f59e0b']
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
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full blur-xl opacity-50" />
                        <div className="relative w-full h-full bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                            <CheckCircle2 className="w-12 h-12 text-white" />
                        </div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="absolute -top-2 -right-2"
                        >
                            <PartyPopper className="w-8 h-8 text-yellow-500" />
                        </motion.div>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-3"
                    >
                        ¡Pago Verificado! 🎉
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-neutral-600 dark:text-neutral-400 text-lg mb-8"
                    >
                        Tu pago ha sido confirmado exitosamente
                    </motion.p>

                    {/* Success Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 border-2 border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-6 mb-8"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-emerald-500 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/25">
                                <CheckCircle2 className="w-6 h-6 text-white dark:text-emerald-400" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-emerald-700 dark:text-emerald-300 mb-1">
                                    ¡Pedido en Proceso!
                                </h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    Hemos iniciado la preparación de tu pedido. Te contactaremos pronto
                                    para coordinar la entrega.
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
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 rounded-full blur-xl opacity-50" />
                        <div className="relative w-full h-full bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
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
                        className="text-neutral-600 dark:text-neutral-400 text-lg mb-8"
                    >
                        No pudimos confirmar tu transferencia
                    </motion.p>

                    {/* Error Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-500/10 dark:to-orange-500/10 border-2 border-red-200 dark:border-red-500/30 rounded-2xl p-6 mb-8"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-red-500 dark:bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/25">
                                <XCircle className="w-6 h-6 text-white dark:text-red-400" />
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
                    className="w-24 h-24 mx-auto mb-6 relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full blur-xl opacity-50" />
                    <div className="relative w-full h-full bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="absolute -top-2 -right-2"
                    >
                        <Sparkles className="w-8 h-8 text-yellow-500" />
                    </motion.div>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-3"
                >
                    ¡Gracias por tu compra!
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-neutral-600 dark:text-neutral-400 text-lg mb-8"
                >
                    Tu pedido ha sido registrado exitosamente
                </motion.p>

                {/* Status Card - Verificando */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10 border border-blue-200 dark:border-blue-500/30 rounded-2xl p-6 mb-8"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-500 dark:bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
                            <Clock className="w-6 h-6 text-white dark:text-blue-400 animate-pulse" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-blue-700 dark:text-blue-300 mb-1">
                                Verificando tu Transferencia
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                Estamos revisando tu pago móvil. Esta página se actualizará
                                automáticamente cuando sea verificado.
                            </p>
                            <div className="mt-3 flex items-center gap-2 text-blue-600 dark:text-blue-400">
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
                    className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-4 mb-8 text-left"
                >
                    <p className="text-sm text-amber-700 dark:text-amber-300/90">
                        <span className="font-bold">💡 Importante:</span> Conserva tu número de referencia
                        del pago móvil por si necesitas comunicarte con nosotros.
                    </p>
                </motion.div>
            </>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-100 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative z-10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center shadow-2xl shadow-neutral-200/50 dark:shadow-black/20"
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
                                 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 shadow-lg"
                    >
                        <Home className="w-5 h-5" />
                        Ir al Inicio
                    </Link>
                    <Link
                        href="/catalogo"
                        className="flex-1 py-3.5 px-6 rounded-xl border-2 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-white font-semibold 
                                 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
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
                        className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
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
        <div className="min-h-screen bg-gradient-to-br from-neutral-100 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex items-center justify-center p-4">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
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
