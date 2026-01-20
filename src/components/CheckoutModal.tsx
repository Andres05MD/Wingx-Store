'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, User, MapPin, Phone, Smartphone, MessageCircle, ArrowLeft, CreditCard, ChevronRight, CheckCircle2, Truck, Store, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useExchangeRate } from '@/context/ExchangeRateContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import PagoMovilForm from './PagoMovilForm';
import { createOrderWithPagoMovil } from '@/services/orderService';
import { PagoMovilData, OrderItem } from '@/types/order';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from './ui/Input';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// Esquema de validación
const checkoutSchema = z.object({
    name: z.string().min(2, 'Ingresa tu nombre completo'),
    phone: z.string().min(6, 'Ingresa un teléfono válido'),
    address: z.string().min(5, 'Ingresa una dirección válida'),
    notes: z.string().optional(),
    deliveryMethod: z.enum(['pickup', 'delivery', 'shipment']),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
    const router = useRouter();
    const { items, totalPrice, clearCart } = useCart();
    const { user, signInWithGoogle } = useAuth();
    const { formatBs } = useExchangeRate();

    const [loading, setLoading] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState<'info' | 'payment-method' | 'pago-movil'>('info');

    // Inicializar React Hook Form
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        trigger,
        formState: { errors },
        reset
    } = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            name: '',
            phone: '',
            address: 'CC Sambil Barquisimeto',
            notes: '',
            deliveryMethod: 'pickup'
        }
    });

    const deliveryMethod = watch('deliveryMethod');
    const formData = watch();

    // Autocompletar datos del usuario
    useEffect(() => {
        if (user) {
            setValue('name', user.displayName || '');
        }
    }, [user, setValue]);

    // Lock body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Reset step
    useEffect(() => {
        if (!isOpen) {
            setCheckoutStep('info');
        }
    }, [isOpen]);

    // Manejadores de Método de Entrega
    const handleDeliveryMethodChange = (method: 'pickup' | 'delivery' | 'shipment') => {
        setValue('deliveryMethod', method);
        if (method === 'pickup') {
            setValue('address', 'CC Sambil Barquisimeto');
        } else {
            setValue('address', '');
        }
    };

    const handleInfoSubmit = async () => {
        const isValid = await trigger();
        if (isValid) {
            setCheckoutStep('payment-method');
        }
    };

    // Notificar al admin por WhatsApp de nuevo pedido
    const notifyAdminNewOrder = (orderId: string, customerName: string, total: number, method: 'pago-movil' | 'whatsapp') => {
        const adminPhone = process.env.NEXT_PUBLIC_ADMIN_PHONE || process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '584121234567';
        const methodLabel = method === 'pago-movil' ? '💳 Pago Móvil' : '💬 WhatsApp';
        const adminMessage = encodeURIComponent(
            `🔔 *NUEVO PEDIDO WEB*\n\n` +
            `📋 *Orden:* #${orderId.slice(0, 6).toUpperCase()}\n` +
            `👤 *Cliente:* ${customerName}\n` +
            `💰 *Total:* $${total.toLocaleString('es-CO')}\n` +
            `📱 *Método:* ${methodLabel}\n\n` +
            `_Revisa el panel de gestión para más detalles._`
        );
        // Formatear número
        let formattedPhone = adminPhone.replace(/[\s\-\(\)\+]/g, '');
        if (!formattedPhone.startsWith('58')) {
            if (formattedPhone.startsWith('0')) formattedPhone = formattedPhone.substring(1);
            formattedPhone = '58' + formattedPhone;
        }
        // Abrir en nueva pestaña (no bloquea flujo del usuario)
        window.open(`https://wa.me/${formattedPhone}?text=${adminMessage}`, '_blank');
    };

    // Lógica de Envío (Pago Móvil y WhatsApp) - Mantenida igual pero optimizada
    const handlePagoMovilSubmit = async (pagoData: PagoMovilData) => {
        if (items.length === 0) {
            toast.error("El carrito está vacío");
            return;
        }
        setLoading(true);
        try {
            const data = formData;
            const orderItems: OrderItem[] = items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                selectedSize: item.selectedSize,
                imageUrl: item.imageUrl,
            }));

            const orderId = await createOrderWithPagoMovil({
                items: orderItems,
                totalPrice,
                customer: {
                    name: data.name,
                    phone: data.phone,
                    address: data.address,
                    email: user?.email || undefined,
                    userId: user?.uid || null,
                    deliveryMethod: data.deliveryMethod,
                },
                notes: data.notes || '',
                clientName: data.name,
                price: totalPrice,
                paidAmount: 0,
                garmentName: items.map(i => `${i.quantity}x ${i.name}`).join(', '),
                size: items.length === 1 ? (items[0].selectedSize || 'Única') : 'Varios',
            }, pagoData);

            clearCart();
            toast.success("¡Pago reportado exitosamente!");

            // Notificar al admin
            notifyAdminNewOrder(orderId, data.name, totalPrice, 'pago-movil');

            onClose();
            router.push(`/gracias?orderId=${orderId}`);
        } catch (error) {
            console.error("Error al procesar pago móvil:", error);
            toast.error("Error al procesar el pago.");
        } finally {
            setLoading(false);
        }
    };

    const handleWhatsAppSubmit = async () => {
        if (items.length === 0) return toast.error("El carrito está vacío");
        setLoading(true);
        try {
            const data = formData;
            const orderData = {
                items,
                totalPrice,
                customer: {
                    name: data.name,
                    phone: data.phone,
                    address: data.address,
                    email: user?.email || 'guest',
                    userId: user?.uid || null,
                    deliveryMethod: data.deliveryMethod
                },
                notes: data.notes || '',
                status: 'Pendiente',
                createdAt: serverTimestamp(),
                clientName: data.name,
                price: totalPrice,
                paidAmount: 0,
                garmentName: items.map(i => `${i.quantity}x ${i.name}`).join(', '),
                size: items.length === 1 ? (items[0].selectedSize || 'Única') : 'Varios',
            };

            const docRef = await addDoc(collection(db, "orders"), orderData);
            const orderId = docRef.id;
            clearCart();

            const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '59170000000';
            let message = `¡Hola Wingx! 🦋 Quisiera procesar mi pedido *#${orderId.slice(0, 6)}* realizado en la web.%0A%0A`;
            message += `👤 *Cliente:* ${data.name}%0A`;

            const methodMap = {
                'pickup': `📍 Punto de Encuentro (${data.address})`,
                'delivery': `🛵 Delivery BQTO (${data.address})`,
                'shipment': `📦 Envío Nacional (${data.address})`
            };
            message += `${methodMap[data.deliveryMethod]}%0A`;

            message += `%0A*Pedido:*%0A`;
            items.forEach(item => {
                message += `▪️ ${item.quantity}x ${item.name} ($${item.price})%0A`;
            });
            message += `💰 *Total: $${totalPrice.toLocaleString('es-CO')}*%0A`;
            if (data.notes) message += `📝 Nota: ${data.notes}%0A`;

            window.open(`https://wa.me/${phone}?text=${message}`, '_blank');

            // Notificar al admin (en una segunda pestaña)
            setTimeout(() => {
                notifyAdminNewOrder(orderId, data.name, totalPrice, 'whatsapp');
            }, 500);

            onClose();
        } catch (error) {
            console.error("Error creating order: ", error);
            toast.error("Error al procesar el pedido.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop con blur más intenso */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60]"
                        onClick={onClose}
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
                        <motion.div
                            initial={{ y: "100%", opacity: 0, scale: 0.96 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: "100%", opacity: 0, scale: 0.96 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white dark:bg-neutral-900 w-full max-w-lg sm:rounded-3xl shadow-2xl overflow-hidden pointer-events-auto border-t sm:border border-neutral-200 dark:border-neutral-800 flex flex-col max-h-[92vh] sm:max-h-[85vh] h-full sm:h-auto rounded-t-3xl"
                        >
                            {/* Header Moderno */}
                            <div className="relative px-8 py-6 border-b border-neutral-100 dark:border-white/5 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {checkoutStep !== 'info' ? (
                                            <button
                                                onClick={() => setCheckoutStep(checkoutStep === 'pago-movil' ? 'payment-method' : 'info')}
                                                className="p-2 -ml-2 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-full transition-colors group"
                                            >
                                                <ArrowLeft size={20} className="text-neutral-600 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                                            </button>
                                        ) : (
                                            <div className="p-2 bg-black dark:bg-white rounded-xl">
                                                <ShoppingCart size={20} className="text-white dark:text-black" />
                                            </div>
                                        )}

                                        <div>
                                            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                                                {checkoutStep === 'info' && 'Finalizar Compra'}
                                                {checkoutStep === 'payment-method' && 'Método de Pago'}
                                                {checkoutStep === 'pago-movil' && 'Reportar Pago'}
                                            </h2>
                                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                                {checkoutStep === 'info' && 'Tus datos de envío'}
                                                {checkoutStep === 'payment-method' && 'Selecciona una opción'}
                                                {checkoutStep === 'pago-movil' && 'Detalles de la transferencia'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-full transition-colors text-neutral-400 hover:text-red-500"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Progress Bar */}
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-neutral-100 dark:bg-white/5">
                                    <motion.div
                                        className="h-full bg-black dark:bg-white"
                                        initial={{ width: "33%" }}
                                        animate={{
                                            width: checkoutStep === 'info' ? "33%"
                                                : checkoutStep === 'payment-method' ? "66%"
                                                    : "100%"
                                        }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                    />
                                </div>
                            </div>

                            {/* Body Scrollable */}
                            <div
                                className="flex-1 overflow-y-auto p-6 scroll-smooth bg-neutral-50/50 dark:bg-black/5 overscroll-contain"
                                data-lenis-prevent
                            >
                                <AnimatePresence mode="wait">
                                    {checkoutStep === 'info' && (
                                        <motion.div
                                            key="info"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-8"
                                        >
                                            {/* Auth Prompt */}
                                            {!user && (
                                                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30 flex items-center justify-between shadow-sm">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-200">
                                                            <User size={16} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-blue-900 dark:text-blue-100">¿Tienes cuenta?</p>
                                                            <p className="text-xs text-blue-700 dark:text-blue-300">Inicia sesión para ahorrar tiempo</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => signInWithGoogle()}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-blue-600/20 hover:scale-105 transition-all active:scale-95"
                                                    >
                                                        Entrar
                                                    </button>
                                                </div>
                                            )}

                                            {/* Production Alert */}
                                            <div className="relative overflow-hidden rounded-2xl bg-neutral-900 dark:bg-white p-5">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                                                <div className="relative flex gap-4 items-start">
                                                    <div className="text-3xl">🧵</div>
                                                    <div>
                                                        <h4 className="text-white dark:text-black font-bold text-sm mb-1">Somos Fabricantes</h4>
                                                        <p className="text-neutral-400 dark:text-neutral-600 text-xs leading-relaxed">
                                                            Tu pedido se confeccionará con dedicación. Tiempo estimado: <span className="text-white dark:text-black font-semibold">5-7 días hábiles</span> tras el pago.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 gap-5">
                                                    <Input
                                                        label="Nombre Completo"
                                                        placeholder="Ej: María Pérez"
                                                        icon={User}
                                                        error={errors.name?.message}
                                                        {...register('name')}
                                                    />

                                                    <Input
                                                        label="Teléfono / WhatsApp"
                                                        placeholder="Ej: 0412 1234567"
                                                        type="tel"
                                                        icon={Phone}
                                                        error={errors.phone?.message}
                                                        {...register('phone')}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 ml-1">
                                                        Método de Entrega
                                                    </label>

                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                        {[
                                                            { id: 'pickup', icon: Store, title: 'Retiro', subtitle: 'Punto Encuentro' },
                                                            { id: 'delivery', icon: Truck, title: 'Delivery', subtitle: 'Barquisimeto' },
                                                            { id: 'shipment', icon: Package, title: 'Envío', subtitle: 'Nacional' }
                                                        ].map((method) => (
                                                            <button
                                                                key={method.id}
                                                                type="button"
                                                                onClick={() => handleDeliveryMethodChange(method.id as any)}
                                                                className={cn(
                                                                    "relative p-3 rounded-2xl border text-left transition-all duration-300 flex flex-col items-start gap-2 overflow-hidden",
                                                                    deliveryMethod === method.id
                                                                        ? "border-black dark:border-white bg-white dark:bg-neutral-800 shadow-md transform scale-[1.02]"
                                                                        : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900"
                                                                )}
                                                            >
                                                                {deliveryMethod === method.id && (
                                                                    <motion.div
                                                                        layoutId="active-pill"
                                                                        className="absolute inset-0 border-2 border-black dark:border-white rounded-2xl pointer-events-none"
                                                                    />
                                                                )}
                                                                <div className={cn(
                                                                    "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                                                                    deliveryMethod === method.id
                                                                        ? "bg-black text-white dark:bg-white dark:text-black"
                                                                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                                                                )}>
                                                                    <method.icon size={16} />
                                                                </div>
                                                                <div>
                                                                    <span className="text-sm font-bold block leading-tight">{method.title}</span>
                                                                    <span className="text-[10px] text-neutral-500 leading-tight block mt-0.5">{method.subtitle}</span>
                                                                </div>
                                                                {deliveryMethod === method.id && (
                                                                    <div className="absolute top-2 right-2 text-black dark:text-white">
                                                                        <CheckCircle2 size={14} className="fill-current" />
                                                                    </div>
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    {/* Conditional Address Input with Animation */}
                                                    <AnimatePresence mode="wait">
                                                        <motion.div
                                                            key={deliveryMethod}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            {deliveryMethod === 'pickup' ? (
                                                                <div className="space-y-1.5">
                                                                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 ml-1">Punto de Retiro</label>
                                                                    <div className="relative">
                                                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                                                                        <select
                                                                            {...register('address')}
                                                                            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none appearance-none transition-shadow"
                                                                        >
                                                                            <option value="CC Sambil Barquisimeto">CC Sambil Barquisimeto</option>
                                                                            <option value="CC Capital Plaza">CC Capital Plaza</option>
                                                                        </select>
                                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                                                                            <ChevronRight size={14} className="rotate-90" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <Input
                                                                    label={deliveryMethod === 'delivery' ? 'Dirección Exacta' : 'Ciudad y Estado'}
                                                                    placeholder={deliveryMethod === 'delivery' ? 'Ej: Av. Lara, Edif. Azul...' : 'Ej: Valencia, Ofc. MRW Centro'}
                                                                    icon={MapPin}
                                                                    error={errors.address?.message}
                                                                    {...register('address')}
                                                                />
                                                            )}
                                                        </motion.div>
                                                    </AnimatePresence>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 ml-1">Notas (Opcional)</label>
                                                    <textarea
                                                        {...register('notes')}
                                                        placeholder="Instrucciones especiales para la entrega..."
                                                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all resize-none text-sm min-h-[80px]"
                                                    />
                                                </div>
                                            </div>


                                        </motion.div>
                                    )}

                                    {checkoutStep === 'payment-method' && (
                                        <motion.div
                                            key="payment"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            {/* Order Summary Card */}
                                            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-800 shadow-sm flex justify-between items-center">
                                                <div>
                                                    <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Total a Pagar</span>
                                                    <p className="text-2xl font-bold font-heading">${totalPrice.toLocaleString('es-CO')}</p>
                                                    <p className="text-sm text-neutral-500 font-medium">{formatBs(totalPrice)}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs font-medium text-neutral-500">{items.length} Artículos</span>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 ml-1">Selecciona Opción</label>

                                                <button
                                                    onClick={() => setCheckoutStep('pago-movil')}
                                                    className="w-full group relative overflow-hidden p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 hover:shadow-lg hover:shadow-emerald-500/10 transition-all text-left flex items-center gap-4 active:scale-[0.98]"
                                                >
                                                    <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                                                        <Smartphone size={24} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-bold text-neutral-900 dark:text-white">Pago Móvil</h3>
                                                            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wide">
                                                                Rápido
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-emerald-800 dark:text-emerald-200/70">Verificación automática en minutos.</p>
                                                    </div>
                                                    <ChevronRight className="text-emerald-300 dark:text-emerald-800" />
                                                </button>

                                                <button
                                                    onClick={handleWhatsAppSubmit}
                                                    className="w-full group relative overflow-hidden p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-black/10 dark:hover:border-white/10 hover:shadow-lg transition-all text-left flex items-center gap-4 active:scale-[0.98]"
                                                >
                                                    <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <MessageCircle size={24} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-neutral-900 dark:text-white mb-1">Acordar por WhatsApp</h3>
                                                        <p className="text-sm text-neutral-500">Finaliza tu orden y coordina el pago con un asesor.</p>
                                                    </div>
                                                    <ChevronRight className="text-neutral-300" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {checkoutStep === 'pago-movil' && (
                                        <motion.div
                                            key="pago-movil"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="h-full"
                                        >
                                            <PagoMovilForm
                                                totalAmount={totalPrice}
                                                onSubmit={handlePagoMovilSubmit}
                                                onCancel={() => setCheckoutStep('payment-method')}
                                                isLoading={loading}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Footer Sticky */}
                            {checkoutStep === 'info' && (
                                <div className="p-6 border-t border-neutral-100 dark:border-white/5 bg-white dark:bg-neutral-900 z-20">
                                    <div className="flex items-center justify-between mb-4 px-1">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-neutral-500 uppercase font-medium">Total Estimado</span>
                                            <span className="text-2xl font-bold font-heading">${totalPrice.toLocaleString('es-CO')}</span>
                                            <span className="text-xs text-neutral-400 font-medium text-right">{formatBs(totalPrice)}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleInfoSubmit}
                                        className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold text-lg shadow-xl shadow-black/20 dark:shadow-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                    >
                                        Continuar
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
