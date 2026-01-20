export default function imagekitLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
    if (src.startsWith('https://ik.imagekit.io')) {
        const params = [`w-${width}`];
        if (quality) {
            params.push(`q-${quality}`);
        }
        const paramsString = params.join(',');
        const urlParts = src.split('?');
        if (urlParts.length > 1) {
            // If it already has params? typically ImageKit uses /tr: params or query params
            // Let's assume standard intuitive usage: standard ImageKit URLs often use `tr` query param or path segment.
            // E.g. https://ik.imagekit.io/id/image.jpg?tr=w-300
            return `${src}&tr=${paramsString}`;
        }
        return `${src}?tr=${paramsString}`;
    }

    // If it's a relative path, prepend the endpoint
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
    if (urlEndpoint && !src.startsWith('http')) {
        const params = [`w-${width}`];
        if (quality) params.push(`q-${quality}`);
        const paramsString = params.join(',');
        // handle leading slash
        const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
        const cleanEndpoint = urlEndpoint.endsWith('/') ? urlEndpoint.slice(0, -1) : urlEndpoint;
        return `${cleanEndpoint}/${cleanSrc}?tr=${paramsString}`;
    }

    // Fallback for other URLs (e.g. Firebase Storage direct link if not proxied)
    return src;
}
