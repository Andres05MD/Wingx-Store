"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function WhatsAppButton() {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_PHONE;
    const message = "Hola, me gustaría hacer una consulta sobre un producto Wingx.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-20 md:bottom-6 right-6 z-50 flex items-center justify-center p-4 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Contáctanos por WhatsApp"
        >
            <MessageCircle size={32} fill="white" className="text-white" />
            <span className="sr-only">Contactar por WhatsApp</span>
        </motion.a>
    );
}
