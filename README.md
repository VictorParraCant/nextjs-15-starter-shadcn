# FIMA - Gestor Financiero Personal y Colaborativo

![MIT License](https://img.shields.io/badge/license-MIT-blue) [![TypeScript](https://badgen.net/badge/icon/typescript?icon=typescript&label)](https://typescriptlang.org) ![Next.js 15](https://img.shields.io/badge/Next.js-15-black) ![React 19](https://img.shields.io/badge/React-19-blue)

**FIMA** es un gestor financiero moderno que te permite controlar tus gastos personales, inversiones y gastos compartidos en un solo lugar.

## 🚀 Características

- 💰 **Gestión Personal**: Controla tus ingresos, gastos e inversiones
- 👥 **Gastos Compartidos**: Gestiona gastos de grupo, viajes y compañeros de piso
- 📊 **Analytics Inteligente**: Visualiza tus patrones financieros con gráficas
- 📄 **Importación Automática**: Procesa archivos CSV y PDF de bancos
- 🔐 **Seguridad Bancaria**: Cifrado de nivel bancario y cumplimiento GDPR
- 🌐 **Multi-idioma**: Soporte para español, inglés y catalán
- 📱 **Responsive**: Diseño optimizado para móvil y desktop

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 15** - Framework React con App Router
- **React 19** - Biblioteca de UI
- **TypeScript 5** - Tipado estático
- **Tailwind CSS 4** - Estilos utilitarios
- **shadcn/ui** - Componentes de UI
- **Redux Toolkit** - Gestión de estado global
- **React Hook Form** - Gestión de formularios
- **Recharts** - Gráficas y visualizaciones

### Backend
- **Firebase Auth** - Autenticación de usuarios
- **Firestore** - Base de datos NoSQL
- **Firebase Storage** - Almacenamiento de archivos
- **Firebase Functions** - Funciones serverless

### Herramientas
- **ESLint 9** - Linting de código
- **Prettier 3** - Formateo de código
- **next-intl** - Internacionalización
- **Zod** - Validación de esquemas

## 🏁 Instalación

### Prerrequisitos

- Node.js 20.18.0 o superior
- npm, yarn, pnpm o bun
- Proyecto de Firebase configurado

### Configuración

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/fima.git
   cd fima
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   # o
   yarn install
   # o
   pnpm install
   # o
   bun install
   ```

3. **Configurar variables de entorno**:
   ```bash
   cp .env.example .env.local
   ```
   
   Edita `.env.local` con tus credenciales de Firebase:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
   ```

4. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   # o
   yarn dev
   # o
   pnpm dev
   # o
   bun dev
   ```

5. **Abrir en el navegador**: [http://localhost:3000](http://localhost:3000)

## 🔥 Configuración de Firebase

### 1. Crear proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita Authentication, Firestore y Storage

### 2. Configurar Authentication

- Habilita Email/Password en Authentication > Sign-in method
- Opcionalmente habilita Google OAuth

### 3. Configurar Firestore

Crea las siguientes colecciones según el modelo de datos:

```
firestore/
├── users/
│   └── {userId}/
│       ├── wallets/
│       └── files/
├── categories/
└── sharedGroups/
    └── {groupId}/
        └── sharedTransactions/
```

### 4. Reglas de Firestore (básicas)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Global categories are readable by all authenticated users
    match /categories/{categoryId} {
      allow read: if request.auth != null;
    }
    
    // Shared groups access based on membership
    match /sharedGroups/{groupId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.members[].userId;
    }
  }
}
```

## 📖 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── [locale]/          # Rutas con soporte multi-idioma
│   │   ├── (auth)/        # Páginas de autenticación
│   │   ├── (dashboard)/   # Páginas autenticadas
│   │   └── page.tsx       # Landing page
│   ├── globals.css        # Estilos globales
│   └── layout.tsx         # Layout raíz
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de shadcn/ui
│   ├── auth/             # Componentes de autenticación
│   ├── dashboard/        # Componentes del dashboard
│   └── shared/           # Componentes compartidos
├── lib/                  # Utilidades y configuraciones
│   ├── firebase/         # Configuración de Firebase
│   ├── redux/           # Store y slices de Redux
│   ├── types/           # Tipos de TypeScript
│   └── utils/           # Funciones utilitarias
├── hooks/               # Custom hooks
├── messages/           # Traducciones i18n
└── styles/             # Estilos adicionales
```

## 🎯 Modelo de Datos

### Firestore Collections

#### users/{userId}
```typescript
{
  email: string;
  displayName: string;
  createdAt: string;
  defaultCurrency: string;
  settings: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notificationPreferences: {
      email: boolean;
      push: boolean;
      budgetAlerts: boolean;
    };
  };
}
```

#### users/{userId}/wallets/{walletId}
```typescript
{
  name: string;
  type: 'bank' | 'cash' | 'broker' | 'other';
  institution?: string;
  initialBalance: number;
  createdAt: string;
}
```

#### users/{userId}/wallets/{walletId}/transactions/{transactionId}
```typescript
{
  date: string;
  amount: number;
  type: 'expense' | 'income' | 'investment';
  description: string;
  categoryId: string;
  sourceWalletId?: string;
  destinationWalletId?: string;
  createdFrom: 'manual' | 'csv' | 'pdf';
  fileId?: string;
  groupId?: string;
  userId: string;
  createdAt: string;
}
```

## 🌐 Internacionalización

El proyecto soporta múltiples idiomas usando **next-intl**:

- **Español (es)** - Idioma principal
- **Inglés (en)** - Traducción completa
- **Catalán (ca)** - Traducción completa

### Añadir nuevos idiomas

1. Añade el código del idioma a `i18n.ts`:
   ```typescript
   export const locales = ['en', 'es', 'ca', 'fr'] as const;
   ```

2. Crea el archivo de traducciones:
   ```bash
   cp messages/es.json messages/fr.json
   ```

3. Traduce el contenido del archivo

## 🧪 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo con Turbopack
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Corregir errores de ESLint automáticamente
npm run format       # Formatear código con Prettier
```

## 📊 Análisis del Bundle

Para analizar el tamaño del bundle:

```bash
BUNDLE_ANALYZER_ENABLED=true npm run build
```

## 🚢 Despliegue

### Vercel (Recomendado)

1. Push tu código a GitHub
2. Conecta tu repositorio en [Vercel](https://vercel.com)
3. Configura las variables de entorno
4. Despliega automáticamente

### Docker

```bash
# Build
docker build -t fima .

# Run
docker run -p 3000:3000 fima
```

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🆘 Soporte

Si tienes preguntas o necesitas ayuda:

- 📧 Email: soporte@fima.app
- 💬 Discord: [Únete a nuestra comunidad](https://discord.gg/fima)
- 📚 Documentación: [docs.fima.app](https://docs.fima.app)
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/fima/issues)

---

<p align="center">Hecho con ❤️ en España 🇪🇸</p>