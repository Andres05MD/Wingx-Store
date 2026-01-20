'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Mail, Lock, User, ArrowLeft, LogIn } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function LoginPage() {
    const { signInWithEmail: signIn, registerWithEmail: signUp, signInWithGoogle } = useAuth();
    const router = useRouter();
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
            router.push('/');
        } catch (err: any) {
            console.error(err);
            setError(
                err.code === 'auth/invalid-credential'
                    ? 'Credenciales incorrectas. Verifica tu correo y contraseña.'
                    : 'Ocurrió un error al iniciar sesión. Inténtalo de nuevo.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            router.push('/');
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
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-black">

            {/* Left Side - Visual */}
            <div className="relative hidden lg:flex flex-col justify-between p-12 bg-black text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -mr-20 -mt-20" />

                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium opacity-60 hover:opacity-100 transition-opacity mb-8">
                        <ArrowLeft size={16} /> Volver a la tienda
                    </Link>
                    <h1 className="text-4xl font-bold font-heading mb-2 tracking-tight">WINGX</h1>
                    <p className="opacity-60 max-w-sm">La moda que define tu estilo. Únete a nuestra comunidad y disfruta de beneficios exclusivos.</p>
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                        <p className="text-lg font-medium italic">"Excelente calidad y los diseños son únicos. El proceso de compra fue súper rápido."</p>
                        <div className="flex items-center gap-3 mt-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                            <div>
                                <p className="text-sm font-bold">Sofía Méndez</p>
                                <p className="text-xs opacity-50">Cliente Verificado</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 overflow-y-auto">
                <div className="w-full max-w-md space-y-8">

                    <div className="text-center lg:text-left">
                        <Link href="/" className="lg:hidden inline-flex items-center gap-2 text-sm font-medium text-neutral-500 mb-8">
                            <ArrowLeft size={16} /> Volver a la tienda
                        </Link>
                        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-2">
                            {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
                        </h2>
                        <p className="text-neutral-500 dark:text-neutral-400">
                            {isLogin
                                ? 'Ingresa tus datos para acceder a tu cuenta.'
                                : 'Completa el formulario para registrarte gratis.'}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handleGoogleSignIn}
                            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all font-medium text-sm shadow-sm hover:shadow-md"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continuar con Google
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-neutral-200 dark:border-neutral-800" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-black px-2 text-neutral-500">O continúa con email</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium text-center"
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
                                            label="Nombre Completo"
                                            placeholder="Juan Pérez"
                                            type="text"
                                            icon={User}
                                            error={errors.name?.message}
                                            {...register('name')}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <Input
                                label="Correo Electrónico"
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
                                className="w-full py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold shadow-lg shadow-black/20 dark:shadow-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
                                {!isLoading && <LogIn size={18} />}
                            </button>
                        </form>
                    </div>

                    <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                        {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'} {' '}
                        <button
                            onClick={toggleMode}
                            className="font-bold text-black dark:text-white hover:underline underline-offset-4"
                        >
                            {isLogin ? 'Regístrate gratis' : 'Inicia sesión'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
