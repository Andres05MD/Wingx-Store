export default function imagekitLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
    const params = [`w-${width}`, `q-${quality || 70}`, 'f-auto'];

    if (src.startsWith('https://ik.imagekit.io')) {
        const paramsString = params.join(',');
        const urlParts = src.split('?');
        if (urlParts.length > 1) {
            return `${src}&tr=${paramsString}`;
        }
        return `${src}?tr=${paramsString}`;
    }

    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
    if (urlEndpoint && !src.startsWith('http')) {
        const paramsString = params.join(',');
        const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
        const cleanEndpoint = urlEndpoint.endsWith('/') ? urlEndpoint.slice(0, -1) : urlEndpoint;
        return `${cleanEndpoint}/${cleanSrc}?tr=${paramsString}`;
    }

    return src;
}
