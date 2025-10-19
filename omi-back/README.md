# OMI API

API Backend profesional con sistema completo de autenticación, gestión de usuarios y servicios de video de Pexels.

## 🚀 Tecnologías

- **Node.js** + **Express** + **TypeScript**
- **MongoDB** (Database)
- **JWT** (Autenticación)
- **Resend** (Servicio de Email)
- **Axios** (Peticiones HTTP)
- **bcryptjs** (Encriptación de contraseñas)
- **Clean Architecture**

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env y agrega tus credenciales
```

### Variables de Entorno

```bash
# Server
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/OMI-S
DB_NAME=OMI-S

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3000

# Pexels API
PEXELS_API_KEY=your-pexels-api-key

# Resend Email Service
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=onboarding@resend.dev
EMAIL_FROM_NAME=OMI
RESET_PASSWORD_URL=http://localhost:3000/reset-password
```

**Obtener API Keys:**
- **Pexels:** https://www.pexels.com/api/
- **Resend:** https://resend.com (para emails de recuperación de contraseña)

## 🏃 Ejecución

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## 🧪 Testing

Prueba toda la API con un solo comando:

```bash
# Test completo (Auth + Videos) - Recomendado
npm test

# Test solo usuarios
npm run test:flow:bash

# Test completo versión bash
npm run test:complete:bash
```

**Ver guía completa de testing:** [`TESTING.md`](./TESTING.md)

**Lo que se prueba:**
- ✅ Sistema de autenticación completo
- ✅ Gestión de usuarios (CRUD)
- ✅ Recuperación de contraseña
- ✅ Sistema de videos de Pexels
- ✅ Validaciones y manejo de errores

## 📡 Endpoints

### Autenticación

#### Registrar Usuario
```bash
POST /api/auth/register
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "Juan",
  "lastName": "Pérez",
  "age": 25
}

# Respuesta exitosa
{
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "firstName": "Juan",
      "lastName": "Pérez",
      "age": 25,
      "createdAt": "2025-10-19T...",
      "updatedAt": "2025-10-19T..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "password123"
}

# Respuesta exitosa
{
  "message": "Login successful",
  "data": {
    "user": { /* datos del usuario */ },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Obtener Perfil (requiere autenticación)
```bash
GET /api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN

# Respuesta
{
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "firstName": "Juan",
      "lastName": "Pérez",
      "age": 25,
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

#### Actualizar Perfil (requiere autenticación)
```bash
PUT /api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
{
  "firstName": "Juan Carlos",      // opcional
  "lastName": "Pérez García",      // opcional
  "age": 26,                       // opcional
  "email": "newemail@example.com", // opcional
  "currentPassword": "password123", // requerido si se cambia la contraseña
  "newPassword": "newpassword456"   // opcional
}

# Respuesta exitosa
{
  "message": "Profile updated successfully",
  "data": {
    "user": { /* datos actualizados */ }
  }
}
```

#### Eliminar Cuenta (requiere autenticación)
```bash
DELETE /api/auth/account
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
{
  "password": "password123"
}

# Respuesta exitosa
{
  "message": "Account deleted successfully"
}
```

#### Recuperar Contraseña
```bash
POST /api/auth/forgot-password
Content-Type: application/json
{
  "email": "user@example.com"
}

# Respuesta (siempre exitosa por seguridad)
{
  "message": "If the email exists, a reset link has been sent"
}
```

#### Restablecer Contraseña
```bash
POST /api/auth/reset-password
Content-Type: application/json
{
  "token": "token_from_email",
  "newPassword": "newpassword456"
}

# Respuesta exitosa
{
  "message": "Password reset successfully"
}
```

### Videos de Pexels

#### Buscar Videos

```bash
GET /api/videos/search?query=ocean&page=1&per_page=20
```

**Parámetros:**
- `query` (requerido): Término de búsqueda
- `page`: Página (default: 1)
- `per_page`: Resultados por página (1-80, default: 15)
- `orientation`: `landscape` | `portrait` | `square`
- `size`: `large` | `medium` | `small`
- `min_duration`: Duración mínima en segundos
- `max_duration`: Duración máxima en segundos

**Ejemplos:**
```bash
# Búsqueda básica
curl "http://localhost:3000/api/videos/search?query=nature"

# Con filtros
curl "http://localhost:3000/api/videos/search?query=ocean&orientation=landscape&min_duration=10&max_duration=30"
```

#### Videos Populares

```bash
GET /api/videos/popular?per_page=20
```

**Parámetros:**
- `page`: Página (default: 1)
- `per_page`: Resultados por página (1-80, default: 15)
- `min_width`: Ancho mínimo en píxeles
- `min_height`: Alto mínimo en píxeles
- `min_duration`: Duración mínima en segundos
- `max_duration`: Duración máxima en segundos

**Ejemplo:**
```bash
# Videos Full HD
curl "http://localhost:3000/api/videos/popular?min_width=1920&min_height=1080"
```

#### Video por ID

```bash
GET /api/videos/:id
```

**Ejemplo:**
```bash
curl "http://localhost:3000/api/videos/123456"
```

## 📦 Formato de Respuesta

### Respuesta Exitosa

```json
{
  "success": true,
  "data": {
    "page": 1,
    "perPage": 15,
    "totalResults": 5000,
    "hasMore": true,
    "videos": [
      {
        "id": 123456,
        "width": 1920,
        "height": 1080,
        "duration": 30,
        "tags": ["nature", "ocean"],
        "url": "https://www.pexels.com/video/...",
        "thumbnail": "https://images.pexels.com/...",
        "user": {
          "name": "John Doe",
          "url": "https://www.pexels.com/@johndoe"
        },
        "files": [
          {
            "quality": "hd",
            "width": 1920,
            "height": 1080,
            "link": "https://player.vimeo.com/..."
          }
        ]
      }
    ]
  }
}
```

### Respuesta de Error

```json
{
  "success": false,
  "message": "Query parameter is required"
}
```

## 🔌 Integración con Frontend

### Servicio TypeScript

```typescript
// services/videoApi.ts
const API_BASE_URL = 'http://localhost:3000/api/videos';

export interface Video {
  id: number;
  width: number;
  height: number;
  duration: number;
  tags: string[];
  url: string;
  thumbnail: string;
  user: { name: string; url: string };
  files: { quality: string; width: number; height: number; link: string }[];
}

export const videoApi = {
  async searchVideos(query: string, page = 1, perPage = 15) {
    const response = await fetch(
      `${API_BASE_URL}/search?query=${query}&page=${page}&per_page=${perPage}`
    );
    return response.json();
  },

  async getPopularVideos(page = 1, perPage = 15) {
    const response = await fetch(
      `${API_BASE_URL}/popular?page=${page}&per_page=${perPage}`
    );
    return response.json();
  },

  async getVideoById(id: number) {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    return response.json();
  },
};
```

### Hook de React

```typescript
// hooks/useVideos.ts
import { useState, useEffect } from 'react';
import { videoApi } from '@/services/videoApi';

export const useSearchVideos = (query: string) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!query) return;
      
      setLoading(true);
      try {
        const result = await videoApi.searchVideos(query);
        if (result.success) {
          setVideos(result.data.videos);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [query]);

  return { videos, loading, error };
};
```

### Uso en Componente

```typescript
// pages/videos.tsx
import { useSearchVideos } from '@/hooks/useVideos';

export default function VideosPage() {
  const { videos, loading, error } = useSearchVideos('nature');

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {videos.map((video) => (
        <div key={video.id}>
          <video src={video.files[0]?.link} poster={video.thumbnail} controls />
          <p>{video.user.name}</p>
        </div>
      ))}
    </div>
  );
}
```

## 🏗️ Arquitectura (Clean Architecture)

```
src/
├── config/                      # Configuración y variables de entorno
├── domain/                      # Lógica de negocio (independiente de frameworks)
│   ├── entities/
│   │   └── user.entity.ts      # Entidad User con métodos de negocio
│   ├── repositories/
│   │   └── user.repository.ts  # Interface del repositorio
│   └── use-cases/              # Casos de uso (reglas de negocio)
│       ├── register.use-case.ts
│       ├── login.use-case.ts
│       ├── update-profile.use-case.ts
│       ├── delete-account.use-case.ts
│       ├── forgot-password.use-case.ts
│       └── reset-password.use-case.ts
├── infrastructure/              # Implementaciones de servicios externos
│   ├── database/
│   │   └── connection.ts       # Conexión a MongoDB
│   ├── repositories/
│   │   └── mongo-user.repository.ts  # Implementación del repositorio
│   └── services/
│       ├── pexels.service.ts   # Servicio de Pexels API
│       └── email.service.ts    # Servicio de email con Resend
├── presentation/               # Capa de presentación (Express)
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── pexels.controller.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   └── pexels.routes.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts   # Verificación de JWT
│   │   └── error.middleware.ts  # Manejo de errores
│   └── app.ts                   # Configuración de Express
└── types/                       # TypeScript types e interfaces
```

## ✨ Características

### Autenticación y Gestión de Usuarios
- ✅ Registro completo de usuarios (nombre, apellido, edad, email, contraseña)
- ✅ Login con JWT (tokens con expiración)
- ✅ Actualización de perfil (todos los campos)
- ✅ Cambio de contraseña (con verificación de contraseña actual)
- ✅ Eliminación de cuenta (con verificación de contraseña)
- ✅ Recuperación de contraseña por email (usando Resend)
- ✅ Tokens de reset con expiración (1 hora)
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Validación de edad (13-120 años)

### Arquitectura y Desarrollo
- ✅ Clean Architecture
- ✅ Type-safe con TypeScript
- ✅ Repository Pattern
- ✅ Dependency Injection
- ✅ Casos de uso separados
- ✅ Middleware de autenticación
- ✅ Manejo global de errores

### Servicios Externos
- ✅ Integración Pexels Videos API
- ✅ Servicio de Email con Resend
- ✅ Base de datos MongoDB
- ✅ Filtros avanzados de búsqueda
- ✅ Respuestas optimizadas

## 📝 Notas Importantes

### Seguridad
- Las contraseñas se hashean con bcrypt (12 rounds)
- Los tokens JWT expiran en 24h (configurable)
- Los tokens de reset de contraseña expiran en 1 hora
- Las contraseñas nunca se devuelven en las respuestas
- El endpoint de forgot-password no revela si el email existe

### Emails (Resend)
- **Resend** se usa para enviar emails de recuperación
- **⚠️ IMPORTANTE en desarrollo:** Resend solo permite enviar emails a tu propio correo verificado
- Email de prueba: `onboarding@resend.dev` (funciona sin dominio verificado)
- Para enviar a cualquier email: verifica tu dominio en [resend.com/domains](https://resend.com/domains)
- Para producción: verifica tu dominio y usa un email de tu dominio como remitente

### Validaciones
- Email: formato válido
- Contraseña: mínimo recomendado (implementar según necesidad)
- Edad: entre 13 y 120 años
- Todos los campos son trimmed y sanitizados

### Base de Datos
- MongoDB con índice único en email
- Timestamps automáticos (createdAt, updatedAt)
- Soft delete no implementado (se puede agregar)

### Pexels API
- **Rate Limit:** 200 requests/hora (plan gratuito)
- **Calidades disponibles:** 4K, HD, SD
- **Paginación:** Máximo 80 resultados por página

## 🔗 Recursos

- [Resend Docs](https://resend.com/docs)
- [Pexels API Docs](https://www.pexels.com/api/documentation/)
- [Express Docs](https://expressjs.com/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [MongoDB Docs](https://www.mongodb.com/docs/)
- [JWT.io](https://jwt.io/)
