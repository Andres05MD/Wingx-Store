import React from 'react';
import { PiScissorsBold, PiWhatsappLogoBold } from "react-icons/pi";

export default function CustomOrderCard() {
    return (
        <div className="mt-6 p-6 rounded-xl bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-black dark:bg-white rounded-lg shadow-md text-white dark:text-black">
                    <PiScissorsBold className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                        Somos Fabricantes
                    </h3>
                    <p className="text-[10px] uppercase tracking-wide text-neutral-600 dark:text-neutral-400 font-semibold">
                        Confección a Medida
                    </p>
                </div>
            </div>

            <p className="text-xs text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
                ¿Te gusta un modelo pero lo prefieres en otro color? <strong className="text-neutral-900 dark:text-white">¡Lo creamos para ti!</strong>
            </p>

            <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE}?text=Hola,%20me%20interesa%20encargar%20una%20prenda%20personalizada.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-black dark:bg-white text-white dark:text-black rounded-lg text-xs font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 shadow-lg transition-all duration-200"
            >
                <span>Personalizar Pedido</span>
                <PiWhatsappLogoBold className="w-4 h-4" />
            </a>
        </div>
    );
}
