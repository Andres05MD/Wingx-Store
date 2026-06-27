'use server';

import { db } from '@/lib/firebase';
import {
    collection,
    addDoc,
    serverTimestamp,
} from 'firebase/firestore';
import { z } from 'zod';

// ── Esquemas de validación server-side ──

const ordenItemSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    price: z.number().positive(),
    quantity: z.number().int().positive(),
    selectedSize: z.string().optional(),
    selectedColor: z.string().optional(),
    imageUrl: z.string().optional(),
});

const clienteSchema = z.object({
    name: z.string().min(2, 'Nombre inválido'),
    phone: z.string().min(6, 'Teléfono inválido'),
    address: z.string().min(5, 'Dirección inválida'),
    email: z.string().email().optional().or(z.literal('')),
    userId: z.string().nullable().optional(),
    deliveryMethod: z.enum(['pickup', 'delivery', 'shipment']),
});

const pagoMovilSchema = z.object({
    bancoOrigen: z.string().min(1),
    telefonoOrigen: z.string().min(6),
    cedulaTitular: z.string().min(4),
    numeroReferencia: z.string().min(4),
    fechaPago: z.string().min(8),
    montoBs: z.number().optional(),
    tasaCambio: z.number().optional(),
    bancoDestino: z.string().optional(),
    telefonoDestino: z.string().optional(),
    cedulaDestino: z.string().optional(),
    comprobanteUrl: z.string().optional(),
});

const crearOrdenWhatsAppSchema = z.object({
    items: z.array(ordenItemSchema).min(1, 'El carrito está vacío'),
    totalPrice: z.number().positive(),
    customer: clienteSchema,
    notes: z.string().optional(),
    garmentName: z.string().optional(),
    size: z.string().optional(),
});

const crearOrdenPagoMovilSchema = crearOrdenWhatsAppSchema.extend({
    pagoMovil: pagoMovilSchema,
});

// ── Tipos de respuesta ──

type ResultadoOrden =
    | { exito: true; ordenId: string }
    | { exito: false; error: string };

// ── Server Actions ──

/**
 * Crea una orden vía WhatsApp (sin pago reportado aún)
 */
export async function crearOrdenWhatsApp(
    datos: z.infer<typeof crearOrdenWhatsAppSchema>
): Promise<ResultadoOrden> {
    try {
        // Validar datos server-side
        const validados = crearOrdenWhatsAppSchema.parse(datos);

        // Recalcular total desde los items (prevenir manipulación de precio)
        const totalCalculado = validados.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const docRef = await addDoc(collection(db, 'orders'), {
            items: validados.items,
            totalPrice: totalCalculado,
            customer: validados.customer,
            notes: validados.notes || '',
            status: 'Pendiente',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            clientName: validados.customer.name,
            price: totalCalculado,
            paidAmount: 0,
            garmentName: validados.garmentName || '',
            size: validados.size || 'Varios',
        });

        return { exito: true, ordenId: docRef.id };
    } catch (error) {
        console.error('Error al crear orden WhatsApp:', error);

        if (error instanceof z.ZodError) {
            const mensajes = error.issues.map((issue: z.ZodIssue) => issue.message).join(', ');
            return { exito: false, error: `Datos inválidos: ${mensajes}` };
        }

        return { exito: false, error: 'No se pudo crear la orden. Intenta de nuevo.' };
    }
}

/**
 * Crea una orden con pago móvil verificado server-side
 */
export async function crearOrdenConPagoMovil(
    datos: z.infer<typeof crearOrdenPagoMovilSchema>
): Promise<ResultadoOrden> {
    try {
        // Validar todos los datos server-side
        const validados = crearOrdenPagoMovilSchema.parse(datos);

        // Recalcular total desde los items (prevenir manipulación de precio)
        const totalCalculado = validados.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const docRef = await addDoc(collection(db, 'orders'), {
            items: validados.items,
            totalPrice: totalCalculado,
            customer: validados.customer,
            notes: validados.notes || '',
            pagoMovil: validados.pagoMovil,
            paymentMethod: 'pago_movil',
            status: 'pending_verification',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            clientName: validados.customer.name,
            price: totalCalculado,
            paidAmount: 0,
            garmentName: validados.garmentName || '',
            size: validados.size || 'Varios',
        });

        return { exito: true, ordenId: docRef.id };
    } catch (error) {
        console.error('Error al crear orden con pago móvil:', error);

        if (error instanceof z.ZodError) {
            const mensajes = error.issues.map((issue: z.ZodIssue) => issue.message).join(', ');
            return { exito: false, error: `Datos inválidos: ${mensajes}` };
        }

        return { exito: false, error: 'No se pudo procesar el pago. Intenta de nuevo.' };
    }
}
