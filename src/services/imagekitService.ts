/**
 * Servicio para subir comprobantes de pago a ImageKit
 */

interface ImageKitAuthParams {
    token: string;
    expire: number;
    signature: string;
}

interface SubidaResultado {
    url: string;
    fileId: string;
    nombre: string;
}

/**
 * Obtiene los parámetros de autenticación del API route
 */
async function obtenerAuthParams(): Promise<ImageKitAuthParams> {
    const respuesta = await fetch('/api/auth/imagekit');
    if (!respuesta.ok) {
        throw new Error('Error al obtener autenticación de ImageKit');
    }
    return respuesta.json();
}

/**
 * Sube un comprobante de pago a ImageKit
 * @param archivo - El archivo de imagen del comprobante
 * @param carpeta - Carpeta destino en ImageKit (default: /comprobantes)
 * @returns URL del comprobante subido
 */
export async function subirComprobante(
    archivo: File,
    carpeta: string = '/comprobantes'
): Promise<SubidaResultado> {
    // 1. Obtener auth params
    const authParams = await obtenerAuthParams();

    // 2. Preparar el FormData
    const formData = new FormData();
    formData.append('file', archivo);
    formData.append('fileName', `comprobante_${Date.now()}_${archivo.name}`);
    formData.append('folder', carpeta);
    formData.append('publicKey', process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '');
    formData.append('signature', authParams.signature);
    formData.append('expire', String(authParams.expire));
    formData.append('token', authParams.token);

    // 3. Subir a ImageKit
    const respuesta = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: formData,
    });

    if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => null);
        console.error('Error al subir comprobante:', errorData);
        throw new Error('No se pudo subir el comprobante. Intenta de nuevo.');
    }

    const data = await respuesta.json();

    return {
        url: data.url,
        fileId: data.fileId,
        nombre: data.name,
    };
}

/**
 * Valida que el archivo sea una imagen válida
 */
export function validarImagen(archivo: File): { valido: boolean; error?: string } {
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    const tamanoMaximo = 10 * 1024 * 1024; // 10MB

    if (!tiposPermitidos.includes(archivo.type)) {
        return {
            valido: false,
            error: 'Solo se permiten imágenes (JPG, PNG, WebP)',
        };
    }

    if (archivo.size > tamanoMaximo) {
        return {
            valido: false,
            error: 'La imagen no debe superar 10MB',
        };
    }

    return { valido: true };
}
