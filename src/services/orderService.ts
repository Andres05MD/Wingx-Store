'use client';

import { db } from '@/lib/firebase';
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    serverTimestamp,
    query,
    where,
    getDocs,
    orderBy,
    getDoc
} from 'firebase/firestore';
import { StoreOrder, PagoMovilData, OrderStatus } from '@/types/order';

const ORDERS_COLLECTION = 'orders';

/**
 * Crea una nueva orden en Firestore
 */
export const createOrder = async (orderData: Omit<StoreOrder, 'id' | 'createdAt'>): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
            ...orderData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error('Error al crear orden:', error);
        throw new Error('No se pudo crear la orden. Por favor, intenta de nuevo.');
    }
};

/**
 * Actualiza los datos de pago móvil en una orden existente
 */
export const updateOrderWithPagoMovil = async (
    orderId: string,
    pagoMovilData: PagoMovilData
): Promise<void> => {
    try {
        const orderRef = doc(db, ORDERS_COLLECTION, orderId);
        await updateDoc(orderRef, {
            pagoMovil: pagoMovilData,
            paymentMethod: 'pago_movil',
            status: 'pending_verification' as OrderStatus,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error al actualizar orden con pago móvil:', error);
        throw new Error('No se pudo registrar el pago. Por favor, intenta de nuevo.');
    }
};

/**
 * Crea una orden con pago móvil en un solo paso
 */
export const createOrderWithPagoMovil = async (
    orderData: Omit<StoreOrder, 'id' | 'createdAt' | 'status' | 'paymentMethod'>,
    pagoMovilData: PagoMovilData
): Promise<string> => {
    try {
        const fullOrder: Omit<StoreOrder, 'id' | 'createdAt'> = {
            ...orderData,
            pagoMovil: pagoMovilData,
            paymentMethod: 'pago_movil',
            status: 'pending_verification',
        };

        return await createOrder(fullOrder);
    } catch (error) {
        console.error('Error al crear orden con pago móvil:', error);
        throw new Error('No se pudo procesar tu pedido. Por favor, intenta de nuevo.');
    }
};

/**
 * Obtiene una orden por su ID
 */
export const getOrderById = async (orderId: string): Promise<StoreOrder | null> => {
    try {
        const docRef = doc(db, ORDERS_COLLECTION, orderId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as StoreOrder;
        }
        return null;
    } catch (error) {
        console.error('Error al obtener orden:', error);
        return null;
    }
};

/**
 * Obtiene órdenes pendientes de verificación (para admin)
 */
export const getPendingVerificationOrders = async (): Promise<StoreOrder[]> => {
    try {
        const q = query(
            collection(db, ORDERS_COLLECTION),
            where('status', '==', 'pending_verification'),
            orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StoreOrder));
    } catch (error) {
        console.error('Error al obtener órdenes pendientes:', error);
        throw new Error('No se pudieron cargar las órdenes pendientes.');
    }
};

/**
 * Aprueba un pago (para admin)
 */
export const approvePayment = async (orderId: string): Promise<void> => {
    try {
        const orderRef = doc(db, ORDERS_COLLECTION, orderId);
        await updateDoc(orderRef, {
            status: 'paid' as OrderStatus,
            updatedAt: serverTimestamp(),
            verifiedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error al aprobar pago:', error);
        throw new Error('No se pudo aprobar el pago.');
    }
};

/**
 * Rechaza un pago (para admin)
 */
export const rejectPayment = async (orderId: string, reason?: string): Promise<void> => {
    try {
        const orderRef = doc(db, ORDERS_COLLECTION, orderId);
        await updateDoc(orderRef, {
            status: 'rejected' as OrderStatus,
            rejectionReason: reason || 'Pago no encontrado',
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error al rechazar pago:', error);
        throw new Error('No se pudo rechazar el pago.');
    }
};

/**
 * Simula el envío de email de confirmación
 * En producción, esto se conectaría a un servicio de email real
 */
export const sendEmailConfirmation = async (orderId: string, customerEmail: string): Promise<void> => {
    // Simulación - en producción usar SendGrid, Resend, etc.
    console.log(`📧 [SIMULADO] Enviando email de confirmación a: ${customerEmail}`);
    console.log(`   Orden ID: ${orderId}`);
    console.log(`   Asunto: ¡Tu pago ha sido verificado!`);
    console.log(`   Contenido: Tu pedido está siendo procesado...`);

    // Simular delay de envío
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log(`✅ Email enviado exitosamente (simulado)`);
};
