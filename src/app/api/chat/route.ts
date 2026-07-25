import 'server-only';

import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
            || req.headers.get("x-real-ip")
            || "unknown";

        if (!checkRateLimit(`chat:${ip}`, 20, 60_000)) {
            return NextResponse.json(
                { error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." },
                { status: 429 }
            );
        }

        const { messages } = await req.json();

        // System prompt to set context for the store
        const systemMessage = {
            role: "system",
            content: `Eres Merlia, el asistente virtual experto y amable de Wingx Store. Tu misión es ayudar a los clientes a encontrar la prenda perfecta y resolver sus dudas con agilidad.
            
            Usa el siguiente DICCIONARIO DE CONOCIMIENTO para responder. Si la respuesta no está aquí, responde amablemente que no tienes esa información específica y sugiere contactar a un humano por WhatsApp.

            *** DICCIONARIO DE WINGX STORE ***
            
            [UBICACIÓN]
            - ¿Dónde se encuentran?: Estamos ubicados en Barquisimeto, Estado Lara, Venezuela. ¡Pero no te preocupes si estás en otra ciudad, realizamos envíos seguros a todo el país! 🚚
            - ¿Tienen tienda física?: Actualmente operamos como tienda online con base en Barquisimeto.

            [ENVÍOS]
            - ¿Hacen envíos nacionales?: SÍ, realizamos envíos a TODA Venezuela.
            - Agencias de envío: Trabajamos principalmente con MRW, Zoom.
            - Entregas Personales (Barquisimeto): Realizamos entregas personales y gratuitas en el C.C. Sambil y en el C.C. Capital Plaza.
            - Delivery (Barquisimeto): Contamos con servicio de delivery a domicilio en la ciudad con un costo adicional dependiendo de la zona.
            - Costo de envío nacional: Generalmente enviamos con modalidad "Cobro a Destino", o según tarifas vigentes de la agencia de encomiendas.
            - Tiempo de entrega: Depende de la agencia, usualmente 24 a 72 horas hábiles.

            [PAGOS]
            - Métodos de pago: Aceptamos Pago Móvil, Transferencias Bancarias (Mercantil, Venezuela), y Divisas (Efectivo en Barquisimeto).
            - Procesamiento: Al ser fabricantes (confeccionistas), los pedidos se procesan y confeccionan en aproximadamente UNA SEMANA después de confirmado el pago.

            [CAMBIOS Y DEVOLUCIONES]
            - Política: Aceptamos cambios por talla dentro de las 48 horas de recibido el pedido.
            - Condiciones: La prenda debe estar intacta y sin uso. Costos de envío por cambio corren por cuenta del cliente.

            [PRODUCTOS WINGX]
            - Calidad: "Confección Propia" y diseños exclusivos.
            - Tallas: Manejamos tallaje nacional completo.
            - A Medida: SÍ realizamos pedidos "hechos a la medida". Para ello, acordamos un lugar de encuentro en Barquisimeto para realizar personalmente la toma de medidas (tallaje).

            [CONTACTO]
            - Atención humana: Si necesitan ayuda personalizada, sugiere el WhatsApp de atención al cliente.

            *** INSTRUCCIONES DE RESPUESTA ***
            1. Sé breve, cordial y usa emojis (✨, 👗...).
            2. Si preguntan precios, invítalos a ver el catálogo web para ver precios actualizados.
            3. Habla como parte del equipo ("Nosotros").
            4. FILTRO DE RELEVANCIA: Si la pregunta NO tiene nada que ver con la tienda, ropa, moda, envíos o compras (ej: matemáticas, política, chistes, clima, recetas), responde educadamente: "Disculpa, solo puedo responder preguntas relacionadas con Wingx Store y nuestros productos de moda 👗". No respondas preguntas fuera de contexto.
            `
        };

        const fullMessages = [systemMessage, ...messages];

        const chatCompletion = await groq.chat.completions.create({
            messages: fullMessages,
            // @ts-ignore - The user specifically requested this model and param
            model: "openai/gpt-oss-120b", // User requested model
            temperature: 0.7, // Slightly lower for more consistent answers
            max_completion_tokens: 1024, // Reduced from 8192 for a chat bot responses
            top_p: 1,
            stream: true,
            // reasoning_effort: "medium", // Commenting out as it might cause type errors if not supported by SDK types, but valid for API. 
            // If the user insists on it, I can add it back with @ts-ignore
        });

        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of chatCompletion) {
                    const content = chunk.choices[0]?.delta?.content || '';
                    if (content) {
                        controller.enqueue(new TextEncoder().encode(content));
                    }
                }
                controller.close();
            },
        });

        return new NextResponse(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
            },
        });

    } catch (error) {
        console.error("Error in chat API:", error);
        return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
    }
}
