# 🚀 OMI Backend - Documentación Completa

API REST profesional construida con **Clean Architecture**, **TypeScript**, **Express**, y **MongoDB**. Sistema completo de autenticación, gestión de usuarios, videos de Pexels, favoritos, ratings y comentarios.

---

## 📋 Tabla de Contenidos

- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Casos de Uso](#-casos-de-uso)
- [Servicios Externos](#-servicios-externos)
- [Testing](#-testing)
- [Scripts Disponibles](#-scripts-disponibles)
- [Seguridad](#-seguridad)
- [Despliegue](#-despliegue)

---

## 🛠️ Tecnologías

### Core
- **Node.js** (v20+)
- **Express** (v5.1.0)
- **TypeScript** (v5.9.3)
- **MongoDB** (Atlas / Local)

### Autenticación y Seguridad
- **JWT** (jsonwebtoken)
- **bcryptjs** (hash de contraseñas)

### Servicios Externos
- **Pexels API** (videos)
- **Resend** (emails)

### Desarrollo
- **nodemon** (hot reload)
- **ts-node** (TypeScript execution)

---

## 🏗️ Arquitectura

Este proyecto sigue **Clean Architecture** (Arquitectura Limpia), separando la lógica de negocio de las implementaciones técnicas:

```
┌─────────────────────────────────────────┐
│      Presentation Layer (Express)       │
│  ┌──────────┐  ┌──────────┐            │
│  │Routes    │→ │Controllers│            │
│  └──────────┘  └──────────┘            │
│         │              │                │
│         └──────┬───────┘                │
└─────────────────┼─────────────────────┘
                 │
┌─────────────────┼─────────────────────┐
│      Domain Layer (Pure Logic)       │
│  ┌──────────┐  ┌──────────┐          │
│  │Entities  │  │Use Cases │          │
│  └──────────┘  └──────────┘          │
│         │              │              │
│         └──────┬───────┘              │
└─────────────────┼─────────────────────┘
                 │
┌─────────────────┼─────────────────────┐
│  Infrastructure Layer (External)      │
│  ┌──────────┐  ┌──────────┐          │
│  │Repository│  │Services  │          │
│  │Impl      │  │(Pexels)  │          │
│  └──────────┘  └──────────┘          │
└──────────────────────────────────────┘
```

### Principios Aplicados

1. **Separación de Responsabilidades**: Cada capa tiene una responsabilidad única
2. **Dependency Inversion**: Las capas superiores dependen de abstracciones (interfaces)
3. **Testabilidad**: Fácil de testear sin dependencias externas
4. **Escalabilidad**: Agregar nuevas features no afecta el código existente

---

## 📦 Instalación y Configuración

### 1. Instalar Dependencias

```bash
cd omi-back
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
DB_NAME=OMI-S

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3000

# Pexels API
PEXELS_API_KEY=your-pexels-api-key

# Resend Email Service
RESEND_API_KEY=re_your-resend-api-key
EMAIL_FROM=onboarding@resend.dev
EMAIL_FROM_NAME=OMI
RESET_PASSWORD_URL=http://localhost:3000/reset-password
DEV_EMAIL=johan.steven.rodriguez@correounivalle.edu.co
```

### 3. Obtener API Keys

- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **Pexels**: https://www.pexels.com/api/
- **Resend**: https://resend.com

---

## 📁 Estructura del Proyecto

```
omi-back/
├── src/
│   ├── config/                    # Configuración y variables de entorno
│   │   └── index.ts
│   │
│   ├── domain/                     # Lógica de negocio (pura, sin dependencias)
│   │   ├── entities/               # Entidades del dominio
│   │   │   ├── user.entity.ts
│   │   │   ├── favorite.entity.ts
│   │   │   ├── rating.entity.ts
│   │   │   └── comment.entity.ts
│   │   │
│   │   ├── repositories/           # Interfaces de repositorios
│   │   │   ├── user.repository.ts
│   │   │   ├── favorite.repository.ts
│   │   │   ├── rating.repository.ts
│   │   │   └── comment.repository.ts
│   │   │
│   │   └── use-cases/              # Casos de uso (reglas de negocio)
│   │       ├── register.use-case.ts
│   │       ├── login.use-case.ts
│   │       ├── update-profile.use-case.ts
│   │       ├── delete-account.use-case.ts
│   │       ├── forgot-password.use-case.ts
│   │       ├── reset-password.use-case.ts
│   │       ├── add-favorite.use-case.ts
│   │       ├── remove-favorite.use-case.ts
│   │       ├── list-favorite.use-case.ts
│   │       ├── is-favorite.use-case.ts
│   │       ├── add-rating.use-case.ts
│   │       ├── update-rating.use-case.ts
│   │       ├── delete-rating.use-case.ts
│   │       ├── get.rating.use-case.ts
│   │       ├── add-comment.use-case.ts
│   │       ├── update-comment.use-case.ts
│   │       ├── delete-comment.use-case.ts
│   │       └── list-comments.use-case.ts
│   │
│   ├── infrastructure/             # Implementaciones técnicas
│   │   ├── database/
│   │   │   └── connection.ts       # Conexión a MongoDB
│   │   │
│   │   ├── repositories/           # Implementaciones de repositorios
│   │   │   ├── mongo-user.repository.ts
│   │   │   ├── mongo-favorite.repository.ts
│   │   │   ├── mongo-rating.repository.ts
│   │   │   └── mongo-comment.repository.ts
│   │   │
│   │   └── services/               # Servicios externos
│   │       ├── pexels.service.ts   # Integración con Pexels API
│   │       └── email.service.ts    # Servicio de email con Resend
│   │
│   ├── presentation/               # Capa de presentación (Express)
│   │   ├── app.ts                  # Configuración de Express
│   │   │
│   │   ├── controllers/            # Controladores HTTP
│   │   │   ├── auth.controller.ts
│   │   │   ├── pexels.controller.ts
│   │   │   ├── favorites.controller.ts
│   │   │   ├── ratings.controller.ts
│   │   │   └── comments.controller.ts
│   │   │
│   │   ├── routes/                 # Rutas de Express
│   │   │   ├── auth.routes.ts
│   │   │   ├── pexels.routes.ts
│   │   │   ├── favorites.routes.ts
│   │   │   ├── ratings.routes.ts
│   │   │   └── comments.routes.ts
│   │   │
│   │   └── middleware/             # Middleware personalizado
│   │       ├── auth.middleware.ts  # Verificación de JWT
│   │       └── error.middleware.ts
│   │
│   ├── types/                      # Tipos TypeScript
│   │   ├── index.ts
│   │   └── pexels.types.ts
│   │
│   └── index.ts                    # Punto de entrada
│
├── dist/                           # Código compilado (TypeScript → JavaScript)
├── node_modules/
├── .env                            # Variables de entorno (no commitear)
├── .env.example                    # Ejemplo de variables de entorno
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:3001/api
```

### Autenticación (`/api/auth`)

#### `POST /api/auth/register`
Registra un nuevo usuario.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "Juan",
  "lastName": "Pérez",
  "age": 25
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "firstName": "Juan",
      "lastName": "Pérez",
      "age": 25,
      "createdAt": "2025-01-19T...",
      "updatedAt": "2025-01-19T..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### `POST /api/auth/login`
Inicia sesión con email y contraseña.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "data": {
    "user": { /* datos del usuario */ },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### `GET /api/auth/profile`
Obtiene el perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
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

---

#### `PUT /api/auth/profile`
Actualiza el perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "firstName": "Juan Carlos",      // opcional
  "lastName": "Pérez García",      // opcional
  "age": 26,                       // opcional
  "email": "newemail@example.com", // opcional
  "currentPassword": "password123", // requerido si se cambia la contraseña
  "newPassword": "newpassword456"   // opcional
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "data": {
    "user": { /* datos actualizados */ }
  }
}
```

---

#### `DELETE /api/auth/account`
Elimina la cuenta del usuario autenticado.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Account deleted successfully"
}
```

---

#### `POST /api/auth/forgot-password`
Solicita recuperación de contraseña por email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "If the email exists, a reset link has been sent"
}
```

> **Nota:** Por seguridad, siempre devuelve el mismo mensaje, incluso si el email no existe.

---

#### `POST /api/auth/reset-password`
Restablece la contraseña con el token recibido por email.

**Request Body:**
```json
{
  "token": "token_from_email",
  "newPassword": "newpassword456"
}
```

**Response (200):**
```json
{
  "message": "Password reset successfully"
}
```

---

### Videos (`/api/videos`)

#### `GET /api/videos/search`
Busca videos en Pexels.

**Query Parameters:**
- `query` (requerido): Término de búsqueda
- `page`: Número de página (default: 1)
- `per_page`: Resultados por página (1-80, default: 15)
- `orientation`: `landscape` | `portrait` | `square`
- `size`: `large` | `medium` | `small`
- `min_duration`: Duración mínima en segundos
- `max_duration`: Duración máxima en segundos

**Ejemplo:**
```
GET /api/videos/search?query=ocean&page=1&per_page=20&orientation=landscape&min_duration=10&max_duration=30
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "page": 1,
    "perPage": 20,
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

---

#### `GET /api/videos/popular`
Obtiene videos populares de Pexels.

**Query Parameters:**
- `page`: Número de página (default: 1)
- `per_page`: Resultados por página (1-80, default: 15)
- `min_width`: Ancho mínimo en píxeles
- `min_height`: Alto mínimo en píxeles
- `min_duration`: Duración mínima en segundos
- `max_duration`: Duración máxima en segundos

**Ejemplo:**
```
GET /api/videos/popular?page=1&per_page=20&min_width=1920&min_height=1080
```

---

#### `GET /api/videos/:id`
Obtiene un video específico por ID.

**Ejemplo:**
```
GET /api/videos/123456
```

---

### Favoritos (`/api/favorites`)

Todos los endpoints de favoritos requieren autenticación.

#### `GET /api/favorites`
Lista todos los favoritos del usuario autenticado.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

#### `POST /api/favorites`
Agrega un video a favoritos.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "videoId": 123456,
  "videoData": {
    "id": 123456,
    "width": 1920,
    "height": 1080,
    "duration": 30,
    "url": "https://www.pexels.com/video/...",
    "thumbnail": "https://images.pexels.com/..."
  }
}
```

---

#### `DELETE /api/favorites/:videoId`
Elimina un video de favoritos.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

#### `GET /api/favorites/check/:videoId`
Verifica si un video está en favoritos.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "isFavorite": true
}
```

---

### Ratings (`/api/ratings`)

Todos los endpoints de ratings requieren autenticación.

#### `POST /api/ratings`
Agrega o actualiza un rating.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "videoId": 123456,
  "rating": 5
}
```

---

#### `GET /api/ratings/:videoId`
Obtiene el rating de un usuario para un video específico.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

#### `GET /api/ratings/stats/:videoId`
Obtiene estadísticas de ratings para un video.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "videoId": 123456,
  "averageRating": 4.5,
  "totalRatings": 10,
  "ratingDistribution": {
    "1": 0,
    "2": 1,
    "3": 2,
    "4": 3,
    "5": 4
  }
}
```

---

#### `DELETE /api/ratings/:videoId`
Elimina el rating de un video.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### Comentarios (`/api/comments`)

Todos los endpoints de comentarios requieren autenticación.

#### `GET /api/comments/:videoId`
Lista comentarios de un video.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
- `page`: Número de página (default: 1)
- `limit`: Resultados por página (default: 10)

---

#### `POST /api/comments`
Agrega un comentario a un video.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "videoId": 123456,
  "text": "Excelente video!"
}
```

---

#### `PUT /api/comments/:commentId`
Actualiza un comentario.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "text": "Comentario actualizado"
}
```

---

#### `DELETE /api/comments/:commentId`
Elimina un comentario.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🎯 Casos de Uso

### Autenticación

1. **RegisterUseCase**: Registra un nuevo usuario, valida edad (13-120), verifica email único, hashea contraseña, genera JWT.
2. **LoginUseCase**: Valida credenciales, verifica contraseña, genera JWT.
3. **UpdateProfileUseCase**: Actualiza perfil, valida contraseña actual si se cambia la contraseña.
4. **DeleteAccountUseCase**: Elimina cuenta tras validar contraseña.
5. **ForgotPasswordUseCase**: Genera token de recuperación, envía email con Resend.
6. **ResetPasswordUseCase**: Valida token, actualiza contraseña.

### Favoritos

1. **AddFavoriteUseCase**: Agrega video a favoritos (verifica duplicados).
2. **RemoveFavoriteUseCase**: Elimina video de favoritos.
3. **ListFavoritesUseCase**: Lista todos los favoritos del usuario.
4. **IsFavoriteUseCase**: Verifica si un video está en favoritos.

### Ratings

1. **AddRatingUseCase**: Agrega rating a un video (1-5 estrellas).
2. **UpdateRatingUseCase**: Actualiza rating existente.
3. **DeleteRatingUseCase**: Elimina rating.
4. **GetRatingUseCase**: Obtiene rating de un usuario.
5. **GetRatingStatsUseCase**: Calcula estadísticas de ratings.

### Comentarios

1. **AddCommentUseCase**: Agrega comentario a un video.
2. **UpdateCommentUseCase**: Actualiza comentario propio.
3. **DeleteCommentUseCase**: Elimina comentario propio.
4. **ListCommentsUseCase**: Lista comentarios de un video (paginado).

---

## 🔧 Servicios Externos

### PexelsService

Servicio para interactuar con la API de Pexels.

**Métodos:**
- `searchVideos(options)`: Busca videos con filtros
- `getPopularVideos(options)`: Obtiene videos populares
- `getVideoById(id)`: Obtiene video por ID
- `simplifyVideo(video)`: Simplifica datos de video para frontend
- `simplifyVideos(videos)`: Simplifica múltiples videos

**Rate Limits:**
- Plan gratuito: 200 requests/hora
- Máximo 80 resultados por página

---

### EmailService

Servicio para enviar emails con Resend.

**Métodos:**
- `sendPasswordResetEmail(email, token)`: Envía email de recuperación

**Notas:**
- En desarrollo: emails se envían a `DEV_EMAIL`
- En producción: requiere dominio verificado en Resend

---

## 🧪 Testing

### Ejecutar Tests

```bash
npm test
```

Esto ejecuta un script de testing completo que valida:
- ✅ Registro de usuarios
- ✅ Login
- ✅ Actualización de perfil
- ✅ Eliminación de cuenta
- ✅ Recuperación de contraseña
- ✅ Sistema de videos
- ✅ Endpoints de favoritos
- ✅ Endpoints de ratings
- ✅ Endpoints de comentarios

**Resultado esperado:**
```
✓ 14+ tests pasando
⏱ ~14 segundos
✅ Auth, CRUD, Recuperación, Videos, Favoritos, Ratings, Comentarios
```

---

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor con nodemon (hot reload)

# Build
npm run build            # Compila TypeScript a JavaScript
npm run build:watch      # Compila y observa cambios
npm run build:prod       # Limpia dist/ y compila para producción
npm run clean            # Elimina carpeta dist/

# Producción
npm start                # Inicia servidor en producción (requiere build previo)
npm run start:prod       # Build + Start

# Testing
npm test                 # Ejecuta tests completos
```

---

## 🔒 Seguridad

### Implementado

- ✅ Contraseñas hasheadas con **bcrypt** (12 rounds)
- ✅ Tokens JWT con expiración (24h)
- ✅ Tokens de reset con expiración (1 hora)
- ✅ Middleware de autenticación para rutas protegidas
- ✅ Validación de edad (13-120 años)
- ✅ CORS configurado
- ✅ Sanitización de inputs
- ✅ No revelar si un email existe (forgot-password)

### Recomendaciones

- Usar HTTPS en producción
- Implementar rate limiting
- Validar y sanitizar todos los inputs
- Usar variables de entorno seguras
- Rotar JWT_SECRET periódicamente

---

## 🚀 Despliegue

### Variables de Entorno para Producción

```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://...
JWT_SECRET=super-secret-key-min-32-chars
CORS_ORIGIN=https://tu-frontend.vercel.app
PEXELS_API_KEY=...
RESEND_API_KEY=...
EMAIL_FROM=noreply@tudominio.com
RESET_PASSWORD_URL=https://tu-frontend.vercel.app/reset-password
```

### Pasos

1. **Build del proyecto:**
```bash
npm run build:prod
```

2. **Iniciar servidor:**
```bash
npm start
```

3. **Con PM2 (recomendado):**
```bash
pm2 start dist/index.js --name omi-backend
```

---

## 📚 Recursos

- [Express Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [JWT.io](https://jwt.io/)
- [Pexels API Docs](https://www.pexels.com/api/documentation/)
- [Resend Docs](https://resend.com/docs)

---

## 📝 Notas de Desarrollo

### Clean Architecture Benefits

- ✅ Fácil de testear (mocks simples)
- ✅ Independiente de frameworks
- ✅ Escalable y mantenible
- ✅ Separación clara de responsabilidades

### Patrones Usados

- **Repository Pattern**: Abstracción de acceso a datos
- **Dependency Injection**: Inversión de dependencias
- **Use Case Pattern**: Lógica de negocio encapsulada
- **Middleware Pattern**: Interceptores HTTP

---

**Desarrollado con ❤️ siguiendo Clean Architecture y mejores prácticas**

