import { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PagoMovilData } from '@/types/order';
import { useExchangeRate } from '@/context/ExchangeRateContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Copy, CheckCircle2, Building2, Smartphone, User, Hash, Calendar, Wallet, ImagePlus, X, RefreshCw, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { cn } from '@/lib/utils';
import { subirComprobante, validarImagen } from '@/services/imagekitService';

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
    const { convertToBs, formatBs, rate, loading: rateLoading, refreshRate } = useExchangeRate();
    const [copied, setCopied] = useState(false);
    const [archivoComprobante, setArchivoComprobante] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [subiendoComprobante, setSuibiendoComprobante] = useState(false);
    const [comprobanteSubido, setComprobanteSubido] = useState<string | null>(null);
    const [actualizandoTasa, setActualizandoTasa] = useState(false);
    const inputFileRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<PagoMovilFormValues>({
        resolver: zodResolver(pagoMovilSchema),
        defaultValues: {
            fechaPago: new Date().toISOString().split('T')[0],
            bancoOrigen: '',
            telefonoOrigen: '',
            cedulaTitular: '',
            numeroReferencia: ''
        }
    });

    // Datos del comercio para Pago Móvil
    const storePagoMovil = {
        banco: process.env.NEXT_PUBLIC_PAGO_MOVIL_BANCO || "Mercantil",
        telefono: process.env.NEXT_PUBLIC_PAGO_MOVIL_TELEFONO || "04121234567",
        cedula: process.env.NEXT_PUBLIC_PAGO_MOVIL_CEDULA || "V-12345678"
    };

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

    // Manejar selección de archivo de comprobante
    const manejarSeleccionArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const archivo = e.target.files?.[0];
        if (!archivo) return;

        const validacion = validarImagen(archivo);
        if (!validacion.valido) {
            toast.error(validacion.error || 'Archivo inválido');
            return;
        }

        setArchivoComprobante(archivo);
        setComprobanteSubido(null);

        // Crear preview local
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(archivo);
    };

    // Eliminar comprobante seleccionado
    const eliminarComprobante = () => {
        setArchivoComprobante(null);
        setPreviewUrl(null);
        setComprobanteSubido(null);
        if (inputFileRef.current) {
            inputFileRef.current.value = '';
        }
    };

    // Actualizar tasa BCV
    const manejarActualizarTasa = async () => {
        setActualizandoTasa(true);
        try {
            await refreshRate();
            toast.success('Tasa actualizada');
        } catch {
            toast.error('No se pudo actualizar la tasa');
        } finally {
            setActualizandoTasa(false);
        }
    };

    const submitHandler = async (data: PagoMovilFormValues) => {
        let urlComprobante = comprobanteSubido;

        // Si hay archivo seleccionado pero no subido, subirlo ahora
        if (archivoComprobante && !comprobanteSubido) {
            setSuibiendoComprobante(true);
            try {
                const resultado = await subirComprobante(archivoComprobante);
                urlComprobante = resultado.url;
                setComprobanteSubido(resultado.url);
            } catch (error) {
                toast.error('Error al subir el comprobante. Intenta de nuevo.');
                setSuibiendoComprobante(false);
                return;
            }
            setSuibiendoComprobante(false);
        }

        const completeData: PagoMovilData = {
            ...data,
            montoBs: convertToBs(totalAmount),
            tasaCambio: rate || 0,
            bancoDestino: storePagoMovil.banco,
            telefonoDestino: storePagoMovil.telefono,
            cedulaDestino: storePagoMovil.cedula,
            comprobanteUrl: urlComprobante || undefined,
        };
        await onSubmit(completeData);
    };

    const formattedPhone = storePagoMovil.telefono.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
    const estaEnviando = isLoading || subiendoComprobante;

    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300 overflow-y-auto">
            {/* Header / Info de Pago */}
            <div className="shrink-0 mb-4 p-4 bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-white dark:to-neutral-100 rounded-2xl text-white dark:text-neutral-900 shadow-xl shadow-neutral-500/10 relative overflow-hidden group">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                    <Smartphone size={100} />
                </div>

                <div className="relative z-10 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0 pr-2">
                            <p className="text-white/60 dark:text-black/60 text-[10px] font-medium uppercase tracking-wider mb-0.5">Monto a Pagar</p>
                            <h3 className="text-2xl sm:text-3xl font-bold font-heading tabular-nums tracking-tight break-words">
                                {formatBs(totalAmount)}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-xs text-white/50 dark:text-black/50 font-medium">
                                    Ref: ${totalAmount.toFixed(2)} (Tasa BCV: {rateLoading ? '...' : rate?.toFixed(2)})
                                </p>
                                <button
                                    type="button"
                                    onClick={manejarActualizarTasa}
                                    disabled={actualizandoTasa}
                                    className="p-1 bg-white/10 dark:bg-black/5 rounded-full hover:bg-white/20 dark:hover:bg-black/10 transition-colors disabled:opacity-50"
                                    title="Actualizar tasa BCV"
                                    aria-label="Actualizar tasa de cambio BCV"
                                >
                                    <RefreshCw size={10} className={cn("text-white/70 dark:text-black/70", actualizandoTasa && "animate-spin")} />
                                </button>
                            </div>
                        </div>
                        <div className="shrink-0 flex gap-2">
                            <button
                                onClick={() => {
                                    const text = `Pago Móvil\nBanco: ${storePagoMovil.banco} (${bankCode})\nTeléfono: ${storePagoMovil.telefono}\nCédula: ${storePagoMovil.cedula}\nMonto: ${formatBs(totalAmount)}`;
                                    handleCopy(text);
                                }}
                                className="p-2 bg-white/10 dark:bg-black/5 rounded-xl backdrop-blur-md hover:bg-white/20 dark:hover:bg-black/10 transition-colors"
                                title="Copiar todos los datos"
                            >
                                <Copy size={20} className="text-white dark:text-black" />
                            </button>
                            <div className="p-2 bg-white/10 dark:bg-black/5 rounded-xl backdrop-blur-md">
                                <Wallet className="w-5 h-5 text-white dark:text-black" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-white/10 dark:border-black/5">
                        <div className="flex justify-between items-center gap-2">
                            <span className="text-xs text-white/70 dark:text-black/70 shrink-0">Banco:</span>
                            <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                                <span className="font-semibold text-xs sm:text-sm truncate">{storePagoMovil.banco} ({bankCode})</span>
                                <button
                                    onClick={() => handleCopy(bankCode)}
                                    type="button"
                                    className="shrink-0 p-1 bg-white/10 dark:bg-black/5 rounded-full hover:bg-white/20 dark:hover:bg-black/10 transition-colors"
                                    title="Copiar Banco"
                                >
                                    {copied ? <CheckCircle2 size={12} className="text-green-400" /> : <Copy size={12} />}
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                            <span className="text-xs text-white/70 dark:text-black/70 shrink-0">Teléfono:</span>
                            <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                                <span className="font-semibold text-xs sm:text-sm tabular-nums truncate">{formattedPhone}</span>
                                <button
                                    onClick={() => handleCopy(storePagoMovil.telefono)}
                                    type="button"
                                    className="shrink-0 p-1 bg-white/10 dark:bg-black/5 rounded-full hover:bg-white/20 dark:hover:bg-black/10 transition-colors"
                                    title="Copiar Teléfono"
                                >
                                    <Copy size={12} />
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                            <span className="text-xs text-white/70 dark:text-black/70 shrink-0">Cédula:</span>
                            <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                                <span className="font-semibold text-xs sm:text-sm tabular-nums truncate">{storePagoMovil.cedula}</span>
                                <button
                                    onClick={() => handleCopy(storePagoMovil.cedula)}
                                    type="button"
                                    className="shrink-0 p-1 bg-white/10 dark:bg-black/5 rounded-full hover:bg-white/20 dark:hover:bg-black/10 transition-colors"
                                    title="Copiar Cédula"
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
                    <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white animate-pulse" />
                    <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Datos de tu Transferencia</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Controller
                        name="bancoOrigen"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Banco Origen"
                                icon={Building2}
                                error={errors.bancoOrigen?.message}
                                placeholder="Seleccionar banco..."
                                opciones={BANKS.map((bank) => ({
                                    value: `${bank.name} (${bank.code})`,
                                    label: `${bank.name} (${bank.code})`,
                                }))}
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />

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

                {/* Subida de Comprobante */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 ml-1 flex items-center gap-1.5">
                        <ImagePlus size={14} />
                        Comprobante de Pago
                        <span className="text-[10px] font-normal normal-case tracking-normal text-neutral-400 dark:text-neutral-500">(opcional)</span>
                    </label>

                    <AnimatePresence mode="wait">
                        {previewUrl ? (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="relative group rounded-2xl overflow-hidden border-2 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50"
                            >
                                <img
                                    src={previewUrl}
                                    alt="Vista previa del comprobante de pago"
                                    className="w-full h-40 object-contain bg-neutral-100 dark:bg-neutral-800"
                                />

                                {/* Overlay con acciones */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <button
                                        type="button"
                                        onClick={eliminarComprobante}
                                        className="p-2.5 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 active:scale-95 transition-all cursor-pointer"
                                        aria-label="Eliminar comprobante"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Badge de estado */}
                                <div className="absolute bottom-2 left-2">
                                    {comprobanteSubido ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/90 text-white text-[10px] font-bold backdrop-blur-sm">
                                            <CheckCircle2 size={10} /> Subido
                                        </span>
                                    ) : subiendoComprobante ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/70 text-white text-[10px] font-bold backdrop-blur-sm">
                                            <Loader2 size={10} className="animate-spin" /> Subiendo...
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/70 text-white text-[10px] font-bold backdrop-blur-sm">
                                            <Clock size={10} /> Listo para enviar
                                        </span>
                                    )}
                                </div>

                                {/* Nombre del archivo */}
                                <div className="px-3 py-2 flex items-center justify-between bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700">
                                    <span className="text-xs text-neutral-500 truncate max-w-[200px]">
                                        {archivoComprobante?.name}
                                    </span>
                                    <span className="text-[10px] text-neutral-400 shrink-0 ml-2">
                                        {archivoComprobante && (archivoComprobante.size / 1024 / 1024).toFixed(1)}MB
                                    </span>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.label
                                key="upload"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                htmlFor="comprobante-input"
                                className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-600 bg-neutral-50/50 dark:bg-neutral-800/20 hover:border-black dark:hover:border-white hover:bg-neutral-100 dark:hover:bg-neutral-800/40 transition-all cursor-pointer group active:scale-[0.99]"
                            >
                                <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black text-neutral-500 transition-colors">
                                    <ImagePlus size={20} />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                        Adjuntar captura del pago
                                    </p>
                                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                                        JPG, PNG o WebP • Máximo 10MB
                                    </p>
                                </div>
                            </motion.label>
                        )}
                    </AnimatePresence>

                    <input
                        ref={inputFileRef}
                        id="comprobante-input"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                        onChange={manejarSeleccionArchivo}
                        className="sr-only"
                        aria-label="Seleccionar imagen del comprobante de pago"
                    />
                </div>

                <div className="pt-4 mt-auto">
                    <button
                        type="submit"
                        disabled={estaEnviando}
                        className="w-full py-4 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black rounded-2xl font-bold shadow-lg shadow-black/15 dark:shadow-white/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {estaEnviando ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                {subiendoComprobante ? 'Subiendo comprobante...' : 'Verificando...'}
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
                        disabled={estaEnviando}
                        className="w-full mt-3 py-3 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                    >
                        Volver a Métodos de Pago
                    </button>
                </div>
            </form>
        </div>
    );
}
