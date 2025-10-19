# 📂 Estructura del Proyecto OMI

Descripción completa de la organización del proyecto.

---

## 🌳 Árbol del Proyecto

```
OMI/
│
├── 📄 README.md ⭐                   Documentación principal
├── 📄 INDEX.md                      Índice de navegación
├── 📄 DEPLOYMENT.md                 Guía de deployment
├── 📄 ENV_GUIDE.md                  Guía de variables de entorno
├── 📄 PROJECT_STRUCTURE.md          Este archivo
│
├── 🔧 build-all.sh                  Compilar backend + frontend
├── 🔧 start-all.sh                  Iniciar en producción
├── 🔧 stop-all.sh                   Detener servicios
│
├── 📁 omi-back/                     BACKEND
│   │
│   ├── 📄 README.md                 Documentación del backend
│   ├── 📄 API_EXAMPLES.md           Ejemplos de uso con curl
│   ├── 📄 TESTING.md                Guía de testing
│   │
│   ├── ⚙️ .env                       Desarrollo (local)
│   ├── ⚙️ .env.example               Template
│   ├── ⚙️ .env.production            Producción (Render)
│   │
│   ├── 🧪 test-complete-api.ts      Tests completos (11 tests)
│   ├── 🧪 test-user-flow.ts         Tests de usuarios (9 tests)
│   │
│   ├── 📁 src/                      CÓDIGO FUENTE
│   │   ├── 📁 domain/               Lógica de negocio
│   │   │   ├── 📁 entities/         User entity
│   │   │   ├── 📁 repositories/     Interfaces
│   │   │   └── 📁 use-cases/        6 casos de uso
│   │   │
│   │   ├── 📁 infrastructure/       Implementaciones
│   │   │   ├── 📁 database/         MongoDB connection
│   │   │   ├── 📁 repositories/     MongoDB User repository
│   │   │   └── 📁 services/         Email (Resend), Pexels
│   │   │
│   │   ├── 📁 presentation/         API REST
│   │   │   ├── 📁 controllers/      Auth, Videos
│   │   │   ├── 📁 routes/           Rutas
│   │   │   ├── 📁 middleware/       Auth middleware
│   │   │   └── app.ts               Express app
│   │   │
│   │   ├── 📁 config/               Configuración
│   │   ├── 📁 types/                TypeScript types
│   │   └── index.ts                 Entry point
│   │
│   ├── 📁 dist/                     Código compilado (build)
│   │
│   ├── 📦 package.json              Dependencias y scripts
│   └── 📝 tsconfig.json             Config de TypeScript
│
└── 📁 omi-front/                    FRONTEND
    │
    ├── 📄 README.md                 Documentación del frontend
    ├── 📄 FRONTEND_GUIDE.md         Guía de componentes
    │
    ├── ⚙️ .env.local                 Desarrollo (local)
    ├── ⚙️ .env.example               Template
    ├── ⚙️ .env.production            Producción (Vercel)
    │
    ├── 📁 src/                      CÓDIGO FUENTE
    │   ├── 📁 app/                  App Router (Next.js)
    │   │   ├── page.tsx             Página principal
    │   │   ├── layout.tsx           Layout global
    │   │   ├── globals.css          Estilos globales
    │   │   ├── 📁 videos/           Página de videos
    │   │   ├── 📁 about/            Página about
    │   │   └── 📁 reset-password/   Reset de contraseña
    │   │
    │   ├── 📁 components/           COMPONENTES
    │   │   └── 📁 ui/
    │   │       ├── 📁 auth/         LoginModal, RegisterModal, ForgotPassword
    │   │       ├── 📁 Cuenta/       ModalCuenta (gestión de perfil)
    │   │       ├── 📁 header/       Header
    │   │       ├── 📁 footer/       Footer
    │   │       ├── 📁 carousel/     InfiniteCarousel
    │   │       ├── 📁 movie/        MovieCard, VideoModal
    │   │       ├── button.tsx       UI components
    │   │       └── ...              Más componentes UI
    │   │
    │   └── 📁 lib/                  UTILIDADES
    │       ├── 📁 api/              Servicios de API
    │       │   ├── auth.ts          Auth service (8 métodos)
    │       │   └── videos.ts        Videos service
    │       ├── 📁 types/            TypeScript types
    │       │   └── auth.types.ts    Tipos de autenticación
    │       ├── types.ts             Tipos generales
    │       └── utils.ts             Utilidades
    │
    ├── 📁 .next/                    Build de producción
    │
    ├── 📦 package.json              Dependencias y scripts
    └── 📝 tsconfig.json             Config de TypeScript
```

---

## 📊 Estadísticas

### Backend
- **Archivos TypeScript:** 20+
- **Casos de uso:** 6
- **Controladores:** 2
- **Middleware:** 2
- **Servicios:** 3
- **Endpoints:** 11

### Frontend
- **Páginas:** 4
- **Componentes:** 15+
- **Servicios API:** 2
- **Modales:** 5

### Documentación
- **Archivos MD:** 9
- **Scripts:** 3
- **Tests:** 2

---

## 🔑 Archivos Clave

### Configuración

```
omi-back/.env              → Desarrollo backend
omi-back/.env.production   → Producción backend
omi-front/.env.local       → Desarrollo frontend
omi-front/.env.production  → Producción frontend
```

### Documentación

```
README.md              → Inicio
INDEX.md               → Navegación
DEPLOYMENT.md          → Deploy
ENV_GUIDE.md           → Variables de entorno
PROJECT_STRUCTURE.md   → Este archivo
```

### Entry Points

```
omi-back/src/index.ts         → Backend
omi-front/src/app/page.tsx    → Frontend
```

### Tests

```
omi-back/test-complete-api.ts → 11 tests
omi-back/test-user-flow.ts    → 9 tests
```

---

## 📋 Archivos por Categoría

### 🔧 Scripts Ejecutables
- `build-all.sh` - Compilar proyecto completo
- `start-all.sh` - Iniciar en producción
- `stop-all.sh` - Detener servicios
- `omi-back/test-complete-api.ts` - Suite de tests
- `omi-back/test-user-flow.ts` - Tests de usuarios

### 📚 Documentación
- `README.md` - Principal
- `INDEX.md` - Índice
- `DEPLOYMENT.md` - Deployment
- `ENV_GUIDE.md` - Variables de entorno
- `PROJECT_STRUCTURE.md` - Estructura
- `omi-back/README.md` - Backend
- `omi-back/API_EXAMPLES.md` - Ejemplos
- `omi-back/TESTING.md` - Tests
- `omi-front/README.md` - Frontend
- `omi-front/FRONTEND_GUIDE.md` - Componentes

### ⚙️ Configuración
- `.gitignore` - Archivos ignorados
- `.env.*` - Variables de entorno
- `package.json` - Dependencias
- `tsconfig.json` - TypeScript
- `next.config.ts` - Next.js config

---

## 🎯 Navegación Rápida

**Empezar:** [`README.md`](./README.md)  
**API:** [`omi-back/API_EXAMPLES.md`](./omi-back/API_EXAMPLES.md)  
**Componentes:** [`omi-front/FRONTEND_GUIDE.md`](./omi-front/FRONTEND_GUIDE.md)  
**Deploy:** [`DEPLOYMENT.md`](./DEPLOYMENT.md)  
**Config:** [`ENV_GUIDE.md`](./ENV_GUIDE.md)  

---

**Última actualización:** 2025-10-19

