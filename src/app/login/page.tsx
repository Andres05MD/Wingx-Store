'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { Suspense } from 'react';

// Schemas
const loginSchema = z.object({
    name: z.string().optional(),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
});

const registerSchema = z.object({
    name: z.string().min(2, 'Ingresa tu nombre completo'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type AuthFormValues = z.infer<typeof loginSchema>;

function LoginContent() {
    const { signInWithEmail: signIn, registerWithEmail: signUp, signInWithGoogle } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/';
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<AuthFormValues>({
        resolver: zodResolver(isLogin ? loginSchema : registerSchema),
        mode: 'onChange'
    });

    const onSubmit = async (data: AuthFormValues) => {
        setIsLoading(true);
        setError('');
        try {
            if (isLogin) {
                await signIn(data.email, data.password);
            } else {
                if (!data.name) return;
                await signUp(data.email, data.password, data.name);
            }
            router.push(redirectTo);
        } catch (err: any) {
            console.error(err);
            setError(
                err.code === 'auth/invalid-credential'
                    ? 'Credenciales incorrectas. Verifica tu correo y contraseña.'
                    : 'Ocurrió un error. Inténtalo de nuevo.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            router.push(redirectTo);
        } catch (error) {
            console.error(error);
            setError('Error al iniciar sesión con Google');
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        reset();
    };

    return (
        <div className="grow grid grid-cols-1 lg:grid-cols-2 -mb-24 md:-mb-4">

            {/* Panel izquierdo — Visual */}
            <div className="relative hidden lg:flex flex-col justify-between p-10 xl:p-16 bg-neutral-950 text-white overflow-hidden">
                {/* Texturas atmosféricas */}
                <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
                <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-white/[0.03] blur-[120px]" />
                <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-white/[0.02] blur-[100px]" />

                {/* Líneas decorativas */}
                <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

                {/* Top section */}
                <div className="relative z-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-px bg-white/20" />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">Acceso exclusivo</span>
                        </div>

                        <h1 className="text-5xl xl:text-6xl font-black font-heading tracking-[-0.03em] leading-[0.95]">
                            WINGX
                        </h1>
                        <p className="text-white/40 text-sm leading-relaxed max-w-xs font-light">
                            Moda urbana con confección propia. Únete para acceder a colecciones exclusivas y beneficios únicos.
                        </p>
                    </div>
                </div>

                {/* Bottom section — Testimonial */}
                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="p-6 xl:p-8 bg-white/[0.04] backdrop-blur-sm rounded-2xl border border-white/[0.06]"
                    >
                        <p className="text-sm xl:text-base font-light italic leading-relaxed text-white/70">
                            &quot;Excelente calidad y diseños únicos. El proceso de compra fue rápido y la atención al detalle increíble.&quot;
                        </p>
                        <div className="flex items-center gap-3 mt-5 pt-5 border-t border-white/[0.06]">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-xs font-bold">
                                SM
                            </div>
                            <div>
                                <p className="text-xs font-semibold tracking-wide">Sofía Méndez</p>
                                <p className="text-[10px] uppercase tracking-[0.15em] text-white/30 mt-0.5">Cliente Verificada</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Panel derecho — Formulario */}
            <div className="flex flex-col justify-center items-center px-6 py-10 sm:p-12 lg:p-16 xl:p-20 bg-white dark:bg-black">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-sm space-y-7"
                >
                    {/* Header */}
                    <div className="space-y-2">
                        <AnimatePresence mode="wait">
                            <motion.h2
                                key={isLogin ? 'login' : 'register'}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.3 }}
                                className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white font-heading"
                            >
                                {isLogin ? 'Bienvenido' : 'Crear cuenta'}
                            </motion.h2>
                        </AnimatePresence>
                        <p className="text-sm text-neutral-400 dark:text-neutral-500 font-light">
                            {isLogin
                                ? 'Ingresa tus datos para continuar.'
                                : 'Completa el formulario para unirte.'}
                        </p>
                    </div>

                    {/* Google */}
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center gap-3 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 p-3.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 font-medium text-sm group"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span className="group-hover:translate-x-0.5 transition-transform duration-200">Continuar con Google</span>
                    </button>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-neutral-100 dark:border-neutral-900" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white dark:bg-black px-4 text-[10px] uppercase tracking-[0.2em] text-neutral-300 dark:text-neutral-600 font-medium">
                                o con email
                            </span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
                        <AnimatePresence mode="popLayout">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, height: 0 }}
                                    animate={{ opacity: 1, scale: 1, height: 'auto' }}
                                    exit={{ opacity: 0, scale: 0.95, height: 0 }}
                                    className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium text-center"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <Input
                                        label="Nombre completo"
                                        placeholder="Tu nombre"
                                        type="text"
                                        icon={User}
                                        error={errors.name?.message}
                                        {...register('name')}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Input
                            label="Email"
                            placeholder="tu@email.com"
                            type="email"
                            icon={Mail}
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <Input
                            label="Contraseña"
                            placeholder="••••••••"
                            type="password"
                            icon={Lock}
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm tracking-wide hover:bg-black dark:hover:bg-neutral-100 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed mt-1 shadow-lg shadow-black/10 dark:shadow-white/5"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                <>
                                    {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
                                    {isLogin ? <LogIn size={16} strokeWidth={2.5} /> : <UserPlus size={16} strokeWidth={2.5} />}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle */}
                    <p className="text-center text-xs text-neutral-400 dark:text-neutral-500 pt-1">
                        {isLogin ? '¿Primera vez aquí?' : '¿Ya tienes cuenta?'}{' '}
                        <button
                            onClick={toggleMode}
                            className="font-bold text-neutral-900 dark:text-white hover:underline underline-offset-4 transition-colors"
                        >
                            {isLogin ? 'Crear cuenta' : 'Iniciar sesión'}
                        </button>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="grow flex items-center justify-center">
                <Loader2 className="animate-spin text-neutral-400" size={24} />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
