# 🦋 Wingx Store

Tienda online de moda con sistema de checkout integrado, pagos móviles y gestión en tiempo real.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange?style=flat-square&logo=firebase)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Características

- 🛒 **Catálogo de Productos** - Navegación por categorías, filtros y búsqueda
- 🛍️ **Carrito de Compras** - Persistencia local, gestión de tallas y cantidades
- ❤️ **Lista de Deseos** - Guarda productos para después
- 💳 **Checkout con Pago Móvil** - Integración con bancos venezolanos
- 💬 **Checkout por WhatsApp** - Opción alternativa de contacto directo
- 💱 **Tasa BCV en Tiempo Real** - Conversión automática USD → Bolívares
- 🔔 **Notificaciones al Admin** - WhatsApp automático al recibir pedidos
- 🌙 **Modo Oscuro** - Tema claro/oscuro automático
- 📱 **Diseño Responsive** - Optimizado para móviles
- 🔐 **Autenticación** - Login con Google/Firebase

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Cuenta de Firebase
- Cuenta de ImageKit (opcional, para imágenes)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Andres05MD/Wingx-Store.git
cd Wingx-Store

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## ⚙️ Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# ImageKit
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=

# WhatsApp / Contacto
NEXT_PUBLIC_WHATSAPP_PHONE=584241234567
NEXT_PUBLIC_ADMIN_PHONE=584241234567
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/tutienda

# Pago Móvil (Venezuela)
NEXT_PUBLIC_PAGO_MOVIL_BANCO=Mercantil
NEXT_PUBLIC_PAGO_MOVIL_TELEFONO=04241234567
NEXT_PUBLIC_PAGO_MOVIL_CEDULA=V-12345678
NEXT_PUBLIC_PAGO_MOVIL_TITULAR=Nombre Apellido

# AI Chat (opcional)
GROQ_API_KEY=
```

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router (Next.js 14+)
│   ├── api/               # API Routes
│   ├── catalogo/          # Página de catálogo
│   ├── productos/[id]/    # Página de producto
│   ├── gracias/           # Página post-checkout
│   └── login/             # Autenticación
├── components/            # Componentes React
│   ├── ui/               # Componentes UI reutilizables
│   ├── CartDrawer.tsx    # Carrito lateral
│   ├── CheckoutModal.tsx # Modal de checkout
│   └── ...
├── context/              # React Context providers
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   ├── ExchangeRateContext.tsx
│   └── WishlistContext.tsx
├── lib/                  # Utilidades y configuración
├── services/             # Servicios (Firebase, etc.)
└── types/                # TypeScript types
```

## 🔗 Proyecto Relacionado

Este proyecto funciona junto con [Wingx Gestión](https://github.com/Andres05MD/Wingx-Gestion) - Panel de administración para gestionar pedidos, inventario y verificación de pagos.

## 🛠️ Tecnologías

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Animaciones:** Framer Motion
- **Base de Datos:** Firebase Firestore
- **Autenticación:** Firebase Auth
- **Imágenes:** ImageKit
- **Formularios:** React Hook Form + Zod
- **UI:** Lucide Icons, Sonner (toasts)

## 📦 Scripts

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecta tu repositorio en [Vercel](https://vercel.com)
2. Configura las variables de entorno
3. Deploy automático en cada push

### Otras plataformas

Compatible con cualquier plataforma que soporte Next.js (Netlify, Railway, etc.)

## 📄 Licencia

Proyecto privado - Todos los derechos reservados.

---

Desarrollado con 💜 para **Wingx**
