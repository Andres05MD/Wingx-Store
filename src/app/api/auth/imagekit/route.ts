import 'server-only';

import { NextResponse, NextRequest } from "next/server";
import ImageKit from "imagekit";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
    try {
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
            || request.headers.get("x-real-ip")
            || "unknown";

        if (!checkRateLimit(`imagekit:${ip}`, 10, 60_000)) {
            return NextResponse.json(
                { error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." },
                { status: 429 }
            );
        }

        const imagekit = new ImageKit({
            publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
            urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
        });

        const authenticationParameters = imagekit.getAuthenticationParameters();
        return NextResponse.json(authenticationParameters);
    } catch (error) {
        return NextResponse.json(
            { error: "Error de autenticación con ImageKit" },
            { status: 500 }
        );
    }
}
