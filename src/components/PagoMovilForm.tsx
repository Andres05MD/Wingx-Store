import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PagoMovilData } from '@/types/order';
import { useExchangeRate } from '@/context/ExchangeRateContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Copy, CheckCircle2, Building2, Smartphone, User, Hash, Calendar, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from './ui/Input';
import { cn } from '@/lib/utils';

// Constantes de Bancos (Venezuela)
const BANKS = [
    { code: '0102', name: 'Banco de Venezuela' },
    { code: '0105', name: 'Mercantil' },
    { code: '0108', name: 'Provincial' },
    { code: '0134', name: 'Banesco' },
    { code: '0114', name: 'Bancaribe' },
    { code: '0115', name: 'Exterior' },
    { code: '0137', name: 'Sofitasa' },
    { code: '0151', name: 'BFC' },
    { code: '0163', name: 'Tesoro' },
    { code: '0172', name: 'Bancamiga' },
    { code: '0174', name: 'Banplus' },
    { code: '0177', name: 'Banfanb' },
];

const pagoMovilSchema = z.object({
    bancoOrigen: z.string().min(1, 'Selecciona tu banco'),
    telefonoOrigen: z.string().min(10, 'Teléfono inválido'),
    cedulaTitular: z.string().min(6, 'Cédula inválida'),
    numeroReferencia: z.string().min(4, 'Mínimo 4 últimos dígitos'),
    fechaPago: z.string().min(1, 'Selecciona la fecha'),
});

type PagoMovilFormValues = z.infer<typeof pagoMovilSchema>;

interface PagoMovilFormProps {
    onSubmit: (data: PagoMovilData) => Promise<void>;
    onCancel: () => void;
    totalAmount: number;
    isLoading?: boolean;
}

export default function PagoMovilForm({ onSubmit, onCancel, totalAmount, isLoading = false }: PagoMovilFormProps) {
    const { convertToBs, formatBs, rate, loading: rateLoading } = useExchangeRate();
    const [copied, setCopied] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PagoMovilFormValues>({
        resolver: zodResolver(pagoMovilSchema),
        defaultValues: {
            fechaPago: new Date().toISOString().split('T')[0], // Hoy
            bancoOrigen: '',
            telefonoOrigen: '',
            cedulaTitular: '',
            numeroReferencia: ''
        }
    });

    // Datos del comercio para Pago Móvil (desde variables de entorno)
    const storePagoMovil = {
        banco: process.env.NEXT_PUBLIC_PAGO_MOVIL_BANCO || "Mercantil",
        telefono: process.env.NEXT_PUBLIC_PAGO_MOVIL_TELEFONO || "04121234567",
        cedula: process.env.NEXT_PUBLIC_PAGO_MOVIL_CEDULA || "V-12345678"
    };

    // Buscar código del banco para el botón de copiar
    const bankCode = BANKS.find(b =>
        storePagoMovil.banco.toLowerCase().includes(b.name.toLowerCase()) ||
        b.name.toLowerCase().includes(storePagoMovil.banco.toLowerCase())
    )?.code || "0105";

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copiado al portapapeles");
        setTimeout(() => setCopied(false), 2000);
    };

    const submitHandler = async (data: PagoMovilFormValues) => {
        const completeData: PagoMovilData = {
            ...data,
            montoBs: convertToBs(totalAmount),
            tasaCambio: rate || 0,
            bancoDestino: storePagoMovil.banco,
            telefonoDestino: storePagoMovil.telefono,
            cedulaDestino: storePagoMovil.cedula
        };
        await onSubmit(completeData);
    };

    // Formatear teléfono para mostrar (ej: 0412 123 4567)
    const formattedPhone = storePagoMovil.telefono.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');


    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Header / Info de Pago */}
            <div className="mb-4 p-4 bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-white dark:to-neutral-100 rounded-2xl text-white dark:text-neutral-900 shadow-xl shadow-neutral-500/10 relative overflow-hidden group">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                    <Smartphone size={100} />
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <p className="text-white/60 dark:text-black/60 text-[10px] font-medium uppercase tracking-wider mb-0.5">Monto a Pagar</p>
                            <h3 className="text-2xl sm:text-3xl font-bold font-heading tabular-nums tracking-tight">
                                {formatBs(totalAmount)}
                            </h3>
                            <p className="text-xs text-white/50 dark:text-black/50 font-medium mt-0.5">
                                Ref: ${totalAmount.toFixed(2)} (Tasa BCV: {rateLoading ? '...' : rate?.toFixed(2)})
                            </p>
                        </div>
                        <div className="p-2 bg-white/10 dark:bg-black/5 rounded-xl backdrop-blur-md">
                            <Wallet className="w-5 h-5 text-white dark:text-black" />
                        </div>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-white/10 dark:border-black/5">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-white/70 dark:text-black/70">Banco:</span>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-xs sm:text-sm">{storePagoMovil.banco} ({bankCode})</span>
                                <button
                                    onClick={() => handleCopy(bankCode)}
                                    type="button"
                                    className="p-1 hover:bg-white/10 dark:hover:bg-black/5 rounded-full transition-colors"
                                >
                                    {copied ? <CheckCircle2 size={12} className="text-green-400" /> : <Copy size={12} />}
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-white/70 dark:text-black/70">Teléfono:</span>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-xs sm:text-sm tabular-nums">{formattedPhone}</span>
                                <button
                                    onClick={() => handleCopy(storePagoMovil.telefono)}
                                    type="button"
                                    className="p-1 hover:bg-white/10 dark:hover:bg-black/5 rounded-full transition-colors"
                                >
                                    <Copy size={12} />
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-white/70 dark:text-black/70">Cédula:</span>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-xs sm:text-sm tabular-nums">{storePagoMovil.cedula}</span>
                                <button
                                    onClick={() => handleCopy(storePagoMovil.cedula)}
                                    type="button"
                                    className="p-1 hover:bg-white/10 dark:hover:bg-black/5 rounded-full transition-colors"
                                >
                                    <Copy size={12} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Formulario de Reporte */}
            <form onSubmit={handleSubmit(submitHandler)} className="space-y-4 flex-1">
                <div className="flex items-center gap-2 mb-2 px-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Datos de tu Transferencia</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 ml-1">Banco Origen</label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                            <select
                                {...register('bancoOrigen')}
                                className={cn(
                                    "w-full pl-11 pr-4 py-3 bg-white dark:bg-neutral-900 border rounded-xl text-sm appearance-none transition-all outline-none",
                                    errors.bancoOrigen
                                        ? "border-red-500 focus:ring-2 focus:ring-red-200"
                                        : "border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-blue-500"
                                )}
                            >
                                <option value="" disabled>Seleccionar banco...</option>
                                {BANKS.map((bank) => (
                                    <option key={bank.code} value={`${bank.name} (${bank.code})`}>
                                        {bank.name} ({bank.code})
                                    </option>
                                ))}
                            </select>
                        </div>
                        {errors.bancoOrigen && <p className="text-xs text-red-500 ml-1">{errors.bancoOrigen.message}</p>}
                    </div>

                    <Input
                        label="Teléfono Origen"
                        placeholder="0412 123 4567"
                        type="tel"
                        icon={Smartphone}
                        error={errors.telefonoOrigen?.message}
                        {...register('telefonoOrigen')}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        label="Cédula Titular"
                        placeholder="V-12345678"
                        icon={User}
                        error={errors.cedulaTitular?.message}
                        {...register('cedulaTitular')}
                    />

                    <Input
                        label="Últimos 4 Dígitos (Ref)"
                        placeholder="Ej: 1234"
                        type="tel"
                        maxLength={8}
                        icon={Hash}
                        error={errors.numeroReferencia?.message}
                        {...register('numeroReferencia')}
                    />
                </div>

                <Input
                    label="Fecha de Pago"
                    type="date"
                    icon={Calendar}
                    error={errors.fechaPago?.message}
                    {...register('fechaPago')}
                />

                <div className="pt-4 mt-auto">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Verificando...
                            </>
                        ) : (
                            <>
                                Reportar Pago
                                <CheckCircle2 size={20} />
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="w-full mt-3 py-3 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-xl text-sm font-medium transition-colors"
                    >
                        Volver a Métodos de Pago
                    </button>
                </div>
            </form>
        </div>
    );
}
