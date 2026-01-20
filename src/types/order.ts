// Tipos relacionados con órdenes y pagos

export type OrderStatus =
    | 'pending_verification'  // Pago móvil reportado, esperando verificación
    | 'paid'                  // Pago verificado y aprobado
    | 'rejected'              // Pago rechazado (no encontrado)
    | 'Pendiente'             // Orden creada pero sin pago reportado
    | 'processing'            // En proceso de confección
    | 'shipped'               // Enviado
    | 'delivered';            // Entregado

export type PaymentMethod = 'pago_movil' | 'whatsapp' | 'efectivo';

export interface PagoMovilData {
    bancoOrigen: string;
    telefonoOrigen: string;
    cedulaTitular: string;
    numeroReferencia: string;
    fechaPago: string; // ISO date string (YYYY-MM-DD)
    montoBs?: number;
    tasaCambio?: number;
    bancoDestino?: string;
    telefonoDestino?: string;
    cedulaDestino?: string;
}

export interface CustomerInfo {
    name: string;
    phone: string;
    address: string;
    email?: string;
    userId?: string | null;
    deliveryMethod: 'pickup' | 'delivery' | 'shipment';
}

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    selectedSize?: string;
    imageUrl?: string;
}

export interface StoreOrder {
    id?: string;
    items: OrderItem[];
    totalPrice: number;
    customer: CustomerInfo;
    notes?: string;
    status: OrderStatus;
    paymentMethod?: PaymentMethod;
    pagoMovil?: PagoMovilData;
    createdAt?: Date | { seconds: number; nanoseconds: number };
    updatedAt?: Date | { seconds: number; nanoseconds: number };

    // Para compatibilidad con wingx-gestion
    clientName?: string;
    price?: number;
    paidAmount?: number;
    garmentName?: string;
    size?: string;
}

// Bancos de Venezuela para el selector
export const BANCOS_VENEZUELA = [
    { value: 'mercantil', label: 'Banco Mercantil' },
    { value: 'banesco', label: 'Banesco' },
    { value: 'bdv', label: 'Banco de Venezuela (BDV)' },
    { value: 'provincial', label: 'BBVA Provincial' },
    { value: 'bnc', label: 'Banco Nacional de Crédito (BNC)' },
    { value: 'bicentenario', label: 'Bicentenario' },
    { value: 'exterior', label: 'Banco Exterior' },
    { value: 'bancaribe', label: 'Bancaribe' },
    { value: 'venezolano_credito', label: 'Venezolano de Crédito' },
    { value: 'banplus', label: 'Banplus' },
    { value: 'fondo_comun', label: 'Fondo Común' },
    { value: '100_banco', label: '100% Banco' },
    { value: 'sofitasa', label: 'Sofitasa' },
    { value: 'activo', label: 'Banco Activo' },
    { value: 'otro', label: 'Otro' },
] as const;

// Datos bancarios para recibir pagos (configurados via variables de entorno)
export const DATOS_PAGO_MOVIL = {
    banco: process.env.NEXT_PUBLIC_PAGO_MOVIL_BANCO || 'Tu Banco',
    telefono: process.env.NEXT_PUBLIC_PAGO_MOVIL_TELEFONO || '0414-XXX-XXXX',
    cedula: process.env.NEXT_PUBLIC_PAGO_MOVIL_CEDULA || 'V-XX.XXX.XXX',
    titular: process.env.NEXT_PUBLIC_PAGO_MOVIL_TITULAR || 'Nombre del Titular',
};
