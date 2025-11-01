# 🎨 OMI Frontend - Documentación Completa

Aplicación web moderna construida con **Next.js 15**, **React 19**, **TypeScript**, y **TailwindCSS**. Interfaz completa para autenticación, gestión de videos, favoritos, ratings y comentarios.

---

## 📋 Tabla de Contenidos

- [Tecnologías](#-tecnologías)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Páginas y Rutas](#-páginas-y-rutas)
- [Componentes Principales](#-componentes-principales)
- [Sistema de Autenticación](#-sistema-de-autenticación)
- [Gestión de Estado](#-gestión-de-estado)
- [API Client](#-api-client)
- [Hooks Personalizados](#-hooks-personalizados)
- [UI Components](#-ui-components)
- [Estilos y Theming](#-estilos-y-theming)
- [Deployment](#-deployment)

---

## 🛠️ Tecnologías

### Core
- **Next.js** 15.5.4 (App Router)
- **React** 19.1.0
- **TypeScript** 5.x

### Estilos
- **TailwindCSS** 4.x
- **Radix UI** (componentes accesibles)
- **Lucide React** (iconos)
- **class-variance-authority** (variantes de componentes)

### UI/UX
- **shadcn/ui** (componentes base)
- **React Player** (reproductor de videos)
- **TanStack Query DevTools** (debugging)

### Utilidades
- **Zod** (validación de schemas)
- **clsx** (utilidad para clases CSS)
- **tailwind-merge** (merge de clases Tailwind)

---

## 📦 Instalación y Configuración

### 1. Instalar Dependencias

```bash
cd omi-front
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Para producción:

```env
NEXT_PUBLIC_API_URL=https://omi-g653.onrender.com
```

### 3. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La aplicación se abrirá en: `http://localhost:3000`

---

## 📁 Estructura del Proyecto

```
omi-front/
├── src/
│   ├── app/                        # App Router (Next.js 15)
│   │   ├── layout.tsx             # Layout raíz
│   │   ├── page.tsx               # Página principal (landing)
│   │   ├── globals.css            # Estilos globales
│   │   ├── favicon.ico
│   │   │
│   │   ├── videos/                # Página de videos
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Detalle de video
│   │   │
│   │   ├── fav/                   # Página de favoritos
│   │   │   └── page.tsx
│   │   │
│   │   ├── about/                 # Página "Acerca de"
│   │   │   └── page.tsx
│   │   │
│   │   └── reset-password/        # Recuperación de contraseña
│   │       └── page.tsx
│   │
│   ├── components/                # Componentes React
│   │   ├── auth/                  # Componentes de autenticación
│   │   │   └── ProtectedRoute.tsx
│   │   │
│   │   ├── ui/                    # Componentes UI reutilizables
│   │   │   ├── auth/              # Modales de auth
│   │   │   │   ├── LoginModal.tsx
│   │   │   │   ├── RegisterModal.tsx
│   │   │   │   └── ForgotPasswordModal.tsx
│   │   │   │
│   │   │   ├── Cuenta/            # Gestión de cuenta
│   │   │   │   └── ModalCuenta.tsx
│   │   │   │
│   │   │   ├── header/            # Header principal
│   │   │   │   └── Header.tsx
│   │   │   │
│   │   │   ├── footer/            # Footer
│   │   │   │   └── Footer.tsx
│   │   │   │
│   │   │   ├── sidebar/           # Sidebar de navegación
│   │   │   │   ├── sidebar.tsx
│   │   │   │   └── SearchModal.tsx
│   │   │   │
│   │   │   ├── hero/              # Hero banner
│   │   │   │   └── HeroBanner.tsx
│   │   │   │
│   │   │   ├── features/           # Sección de features
│   │   │   │   └── FeaturesSection.tsx
│   │   │   │
│   │   │   ├── carousel/          # Carousel de videos
│   │   │   │   └── InfiniteCarousel.tsx
│   │   │   │
│   │   │   ├── LoadingStates.tsx  # Estados de carga
│   │   │   └── ...                # Más componentes UI (shadcn)
│   │   │
│   │   └── footer/
│   │       └── Footer.tsx
│   │
│   ├── lib/                       # Utilidades y helpers
│   │   ├── api/                   # Cliente API
│   │   │   ├── auth.ts            # Endpoints de autenticación
│   │   │   ├── videos.ts          # Endpoints de videos
│   │   │   ├── favorites.ts       # Endpoints de favoritos
│   │   │   └── ratings.ts         # Endpoints de ratings
│   │   │
│   │   ├── context/               # Context API
│   │   │   └── AuthContext.tsx    # Context de autenticación
│   │   │
│   │   ├── hooks/                 # Custom hooks
│   │   │   ├── useAuth.ts         # Hook de autenticación
│   │   │   └── useVideos.ts       # Hook de videos
│   │   │
│   │   ├── types/                 # Tipos TypeScript
│   │   │   ├── index.ts           # Tipos generales
│   │   │   └── auth.types.ts      # Tipos de autenticación
│   │   │
│   │   ├── utils.ts               # Utilidades generales
│   │   ├── favorites.ts           # Utilidades de favoritos
│   │   └── subtitles.ts           # Utilidades de subtítulos
│   │
│   └── ...
│
├── public/                         # Archivos estáticos
│   ├── logo.png
│   └── ...
│
├── .env.local                      # Variables de entorno (no commitear)
├── next.config.ts                  # Configuración de Next.js
├── tailwind.config.js             # Configuración de TailwindCSS
├── components.json                 # Configuración de shadcn/ui
├── tsconfig.json                   # Configuración de TypeScript
└── package.json
```

---

## 🗺️ Páginas y Rutas

### `/` - Landing Page
Página principal con hero banner, features y carousel de videos populares.

**Componentes principales:**
- `Header`
- `HeroBanner`
- `FeaturesSection`
- `InfiniteCarousel`

---

### `/videos` - Videos Page
Página principal de videos con búsqueda y filtros.

**Funcionalidades:**
- Búsqueda de videos
- Filtros (orientación, tamaño, duración)
- Grid responsive de videos
- Cargar más videos (paginación)

---

### `/videos/[id]` - Video Detail
Página de detalle de video individual.

**Funcionalidades:**
- Reproductor de video
- Información del video
- Sección de favoritos
- Ratings (ver y agregar)
- Comentarios (ver y agregar)
- Sidebar con navegación

---

### `/fav` - Favoritos
Página con todos los videos favoritos del usuario.

**Funcionalidades:**
- Lista de favoritos
- Eliminar favoritos
- Grid responsive
- Protegida (requiere autenticación)

---

### `/about` - Acerca de
Página informativa sobre la plataforma.

---

### `/reset-password` - Reset Password
Página para restablecer contraseña con token.

**Query Parameters:**
- `token`: Token de recuperación recibido por email

**Funcionalidades:**
- Validación de token
- Formulario de nueva contraseña
- Redirección después de éxito

---

## 🧩 Componentes Principales

### Autenticación

#### `LoginModal`
Modal para iniciar sesión.

**Props:**
```typescript
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister?: () => void;
  onOpenForgotPassword?: () => void;
}
```

**Características:**
- Validación de formulario
- Mostrar/ocultar contraseña
- Manejo de errores
- Integración con `authApi`

---

#### `RegisterModal`
Modal para registro de nuevos usuarios.

**Props:**
```typescript
interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin?: () => void;
}
```

**Validaciones:**
- Edad entre 13-120 años
- Contraseña mínimo 6 caracteres
- Contraseñas deben coincidir
- Email válido

---

#### `ForgotPasswordModal`
Modal para solicitar recuperación de contraseña.

**Props:**
```typescript
interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
}
```

---

#### `ModalCuenta`
Modal completo de gestión de cuenta.

**Secciones:**
1. **Información**: Ver datos del usuario
2. **Editar Perfil**: Modificar datos personales
3. **Seguridad**: Cambiar contraseña
4. **Eliminar Cuenta**: Eliminación con confirmación doble

**Endpoints utilizados:**
- `GET /api/auth/profile`
- `PUT /api/auth/profile`
- `DELETE /api/auth/account`

---

### Navegación

#### `Header`
Header principal con logo, navegación y acciones de usuario.

**Funcionalidades:**
- Logo clickeable (home)
- Botones de autenticación
- Menú de usuario (si está autenticado)

---

#### `Sidebar`
Sidebar lateral con navegación principal.

**Items:**
- BUSCAR: Abre modal de búsqueda
- PELICULA: Navega a `/videos`
- FAVORITOS: Navega a `/fav`
- HISTORIAL: (próximamente)
- CUENTA: Abre modal de cuenta

**Características:**
- Responsive (mobile/desktop)
- Item activo según ruta
- Iconos con Lucide React

---

#### `Footer`
Footer con enlaces y acciones.

**Acciones:**
- Abrir modal de cuenta
- Abrir modal de búsqueda

---

### Videos

#### `HeroBanner`
Banner principal con video destacado.

**Props:**
```typescript
interface HeroBannerProps {
  title: string;
  description: string;
  backdropUrl: string;
  onPlay: () => void;
  isPreview?: boolean;
  badgeText?: string;
  badgeColor?: string;
  titleColor?: string;
  customButton?: React.ReactNode;
}
```

---

#### `InfiniteCarousel`
Carousel infinito de videos.

**Características:**
- Scroll horizontal infinito
- Auto-play opcional
- Responsive
- Loading states

---

## 🔐 Sistema de Autenticación

### AuthContext

Context global para gestión de autenticación.

**Ubicación:** `src/lib/context/AuthContext.tsx`

**Funcionalidades:**
- Estado de usuario
- Estado de autenticación
- Métodos: `login`, `logout`, `updateUser`, `checkAuth`

**Uso:**
```tsx
import { useAuthContext } from '@/lib/context/AuthContext';

function Component() {
  const { user, isAuthenticated, login, logout } = useAuthContext();
  
  // ...
}
```

---

### LocalStorage

El sistema guarda en `localStorage`:

```javascript
{
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: {
    id: "...",
    email: "...",
    firstName: "...",
    lastName: "...",
    age: 25
  }
}
```

---

### ProtectedRoute

Componente para proteger rutas.

**Ubicación:** `src/components/auth/ProtectedRoute.tsx`

**Uso:**
```tsx
<ProtectedRoute>
  <FavoritesPage />
</ProtectedRoute>
```

---

## 📡 API Client

### authApi

Cliente para endpoints de autenticación.

**Ubicación:** `src/lib/api/auth.ts`

**Métodos:**
```typescript
authApi.register(data: RegisterRequest): Promise<AuthResponse>
authApi.login(data: LoginRequest): Promise<AuthResponse>
authApi.getProfile(): Promise<ProfileResponse>
authApi.updateProfile(data: UpdateProfileRequest): Promise<ProfileResponse>
authApi.deleteAccount(data: DeleteAccountRequest): Promise<MessageResponse>
authApi.forgotPassword(data: ForgotPasswordRequest): Promise<MessageResponse>
authApi.resetPassword(data: ResetPasswordRequest): Promise<MessageResponse>
authApi.logout(): void
authApi.isAuthenticated(): boolean
authApi.getToken(): string | null
```

---

### videosAPI

Cliente para endpoints de videos.

**Ubicación:** `src/lib/api/videos.ts`

**Métodos:**
```typescript
videosAPI.search(query: string, options?: SearchOptions): Promise<VideoResponse>
videosAPI.getPopular(options?: PopularOptions): Promise<VideoResponse>
videosAPI.getById(id: number): Promise<Video>
```

---

### favoritesAPI

Cliente para endpoints de favoritos.

**Ubicación:** `src/lib/api/favorites.ts`

**Métodos:**
```typescript
favoritesAPI.list(): Promise<Favorite[]>
favoritesAPI.add(videoId: number, videoData: Video): Promise<Favorite>
favoritesAPI.remove(videoId: number): Promise<void>
favoritesAPI.check(videoId: number): Promise<{ isFavorite: boolean }>
```

---

### ratingsAPI

Cliente para endpoints de ratings.

**Ubicación:** `src/lib/api/ratings.ts`

**Métodos:**
```typescript
ratingsAPI.get(videoId: number): Promise<Rating>
ratingsAPI.add(videoId: number, rating: number): Promise<Rating>
ratingsAPI.update(videoId: number, rating: number): Promise<Rating>
ratingsAPI.delete(videoId: number): Promise<void>
ratingsAPI.getStats(videoId: number): Promise<RatingStats>
```

---

## 🎣 Hooks Personalizados

### useAuth

Hook para autenticación.

**Ubicación:** `src/lib/hooks/useAuth.ts`

**Retorna:**
```typescript
{
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
}
```

---

### useVideos

Hooks para gestión de videos.

**Ubicación:** `src/lib/hooks/useVideos.ts`

**Hooks disponibles:**
- `useFeaturedVideo()`: Obtiene video destacado
- `useSearchVideos(query, options)`: Búsqueda de videos
- `usePopularVideos(options)`: Videos populares

---

## 🎨 UI Components

El proyecto usa **shadcn/ui** como base de componentes.

### Componentes Disponibles

- `Button`
- `Card`
- `Dialog` / `Modal`
- `Input`
- `Label`
- `ScrollArea`
- `Slider`
- `Toast`
- Y más...

**Configuración:** `components.json`

---

## 🎨 Estilos y Theming

### TailwindCSS

El proyecto usa **TailwindCSS 4.x** con configuración personalizada.

**Características:**
- Utilidades de Tailwind
- Dark mode (futuro)
- Responsive design
- Gradientes y animaciones

### Clases Comunes

```css
/* Layout */
min-h-screen, container, mx-auto

/* Spacing */
p-4, m-2, gap-4, space-y-4

/* Colors */
bg-black, text-white, border-gray-800

/* Responsive */
sm:, md:, lg:, xl:
```

---

## 🚀 Deployment

### Variables de Entorno

```env
NEXT_PUBLIC_API_URL=https://tu-backend.com
```

### Build y Deploy

```bash
# Build
npm run build

# Producción local
npm start

# Deploy en Vercel
vercel deploy
```

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura `NEXT_PUBLIC_API_URL` en variables de entorno
3. Deploy automático en cada push

---

## 📱 Responsive Design

El frontend es completamente responsive:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

**Características:**
- Sidebar colapsable en mobile
- Grid adaptativo
- Modales full-screen en mobile
- Touch-friendly

---

## ♿ Accesibilidad

### Implementado

- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ Screen reader support
- ✅ Semantic HTML

---

## 🧪 Testing (Futuro)

```bash
# Ejecutar tests (cuando se implementen)
npm test
```

---

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Documentation](https://www.radix-ui.com/)

---

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo

# Build
npm run build            # Build de producción

# Producción
npm start                # Inicia servidor de producción

# Linting
npm run lint             # Ejecuta ESLint
```

---

**Desarrollado con ❤️ usando Next.js 15 y React 19**

