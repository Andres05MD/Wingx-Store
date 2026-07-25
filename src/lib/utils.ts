import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function sanitizeJsonLd<T>(data: T): string {
  const json = JSON.stringify(data);
  return json.replace(/<script|<\/script|<!--|-->|<!\[CDATA\[|\]\]>/gi, '');
}

export function formatPrice(price: number) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(price);
}
