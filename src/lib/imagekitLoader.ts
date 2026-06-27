export default function imagekitLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
    if (src.startsWith('https://ik.imagekit.io')) {
        const params = [`w-${width}`];
        if (quality) {
            params.push(`q-${quality}`);
        }
        const paramsString = params.join(',');
        const urlParts = src.split('?');
        if (urlParts.length > 1) {
        // Si ya tiene parámetros? típicamente ImageKit usa /tr: parámetros o query params
        // Asumamos uso estándar e intuitivo: URLs de ImageKit usualmente usan parámetro `tr` o segmento de path.
            // E.g. https://ik.imagekit.io/id/image.jpg?tr=w-300
            return `${src}&tr=${paramsString}`;
        }
        return `${src}?tr=${paramsString}`;
    }

    // Si es una ruta relativa, anteponer el endpoint
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
    if (urlEndpoint && !src.startsWith('http')) {
        const params = [`w-${width}`];
        if (quality) params.push(`q-${quality}`);
        const paramsString = params.join(',');
        // manejar barra inicial
        const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
        const cleanEndpoint = urlEndpoint.endsWith('/') ? urlEndpoint.slice(0, -1) : urlEndpoint;
        return `${cleanEndpoint}/${cleanSrc}?tr=${paramsString}`;
    }

    // Fallback para otras URLs (ej. enlace directo de Firebase Storage si no está)
    return src;
}
