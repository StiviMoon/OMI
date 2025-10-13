# 🎬 OMI - Plataforma de Películas

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)

**Plataforma moderna de streaming y gestión de películas con autenticación segura**

[Características](#-características) •
[Stack Tecnológico](#-stack-tecnológico) •
[Instalación](#-instalación) •
[Uso](#-uso) •
[Arquitectura](#-arquitectura)

</div>

---

## 📋 Descripción

OMI es una plataforma de películas full-stack desarrollada con las últimas tecnologías web. Combina un frontend moderno y responsivo con Next.js 15 y un backend robusto con Express.js siguiendo principios de Clean Architecture.

## ✨ Características

### Frontend
- 🎨 **Interfaz Moderna** - Diseño limpio y responsivo con TailwindCSS 4
- 🎥 **Reproductor de Video** - Integración con React Player
- ⚡ **Rendimiento Optimizado** - Next.js 15 con Turbopack
- 🎭 **Componentes Reutilizables** - Sistema de diseño con Radix UI
- 📱 **Responsive Design** - Adaptable a todos los dispositivos
- 🔄 **State Management** - React Query para gestión de datos
- ✅ **Validación Robusta** - Zod para validación de esquemas

### Backend
- 🔐 **Autenticación Segura** - JWT + bcrypt para passwords
- 🗄️ **Base de Datos** - MongoDB con validaciones
- 🏗️ **Clean Architecture** - Separación de capas (Domain, Application, Infrastructure)
- 🔄 **CORS Configurado** - Listo para producción
- 📝 **TypeScript** - Código type-safe y mantenible
- 🎯 **Repository Pattern** - Abstracción de la capa de datos

## 🚀 Stack Tecnológico

### Frontend (`omi-front/`)
```json
{
  "framework": "Next.js 15.5.4",
  "runtime": "React 19",
  "styling": "TailwindCSS 4",
  "ui-components": "Radix UI + Shadcn",
  "icons": "Lucide React",
  "video": "React Player",
  "state-management": "TanStack Query",
  "validation": "Zod",
  "language": "TypeScript 5"
}
```

### Backend (`omi-back/`)
```json
{
  "framework": "Express.js 5",
  "database": "MongoDB 5.9",
  "authentication": "JWT + bcryptjs",
  "architecture": "Clean Architecture",
  "language": "TypeScript 5",
  "runtime": "Node.js 20+"
}
```

## 📁 Estructura del Proyecto

```
OMI/
├── omi-front/                # Frontend - Next.js Application
│   ├── src/
│   │   ├── app/             # App Router (Next.js 15)
│   │   ├── components/      # Componentes reutilizables
│   │   │   └── ui/          # Componentes UI (Button, Card, Input)
│   │   └── lib/             # Utilidades y helpers
│   ├── public/              # Archivos estáticos
│   └── package.json
│
├── omi-back/                # Backend - Express.js API
│   ├── src/
│   │   ├── domain/          # Entidades y lógica de negocio
│   │   │   ├── entities/    # User Entity
│   │   │   ├── repositories/# Interfaces de repositorios
│   │   │   └── use-cases/   # Casos de uso (Login, Register)
│   │   ├── infrastructure/  # Implementaciones externas
│   │   │   ├── database/    # Conexión a MongoDB
│   │   │   └── repositories/# Implementación de repositorios
│   │   ├── presentation/    # Capa HTTP
│   │   │   ├── controllers/ # Auth Controller
│   │   │   ├── middleware/  # Auth & Error Middleware
│   │   │   └── routes/      # Rutas de la API
│   │   ├── config/          # Configuración de la app
│   │   └── types/           # TypeScript types
│   └── package.json
│
├── .gitignore
└── README.md
```

## 📦 Instalación

### Requisitos Previos

- Node.js >= 20.0.0
- npm >= 10.0.0
- MongoDB >= 5.0 (local o Atlas)

### Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/omi.git
cd OMI
```

### Configurar Backend

```bash
# Navegar al directorio del backend
cd omi-back

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp .env.example .env

# Editar .env con tus credenciales
nano .env
```

#### Variables de Entorno (Backend)

Crea un archivo `.env` en `omi-back/` con:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/omi
# O usa MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/omi

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3000
```

### Configurar Frontend

```bash
# Navegar al directorio del frontend
cd ../omi-front

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp .env.local.example .env.local

# Editar .env.local
nano .env.local
```

#### Variables de Entorno (Frontend)

Crea un archivo `.env.local` en `omi-front/` con:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# Environment
NEXT_PUBLIC_ENV=development
```

## 🎯 Uso

### Desarrollo

#### Iniciar Backend

```bash
cd omi-back
npm run dev
```

El servidor estará disponible en `http://localhost:4000`

#### Iniciar Frontend

```bash
cd omi-front
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Producción

#### Backend

```bash
cd omi-back

# Compilar TypeScript
npm run build

# Iniciar servidor
npm start
```

#### Frontend

```bash
cd omi-front

# Crear build optimizado
npm run build

# Iniciar servidor de producción
npm start
```

## 🏗️ Arquitectura

### Backend - Clean Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Presentation Layer                 │
│          (Controllers, Routes, Middleware)           │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│                  Application Layer                   │
│                   (Use Cases)                        │
│         LoginUseCase, RegisterUseCase                │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│                   Domain Layer                       │
│            (Entities, Repositories)                  │
│         Business Logic & Interfaces                  │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│              Infrastructure Layer                    │
│        (Database, External Services)                 │
│         MongoDB Implementation                       │
└─────────────────────────────────────────────────────┘
```

### Frontend - Next.js App Router

```
┌─────────────────────────────────────────────────────┐
│                      App Router                      │
│              (Pages & Layouts)                       │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│                   Components Layer                   │
│        (UI Components & Business Logic)              │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│                    Services Layer                    │
│            (API Calls, State Management)             │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│                      API Layer                       │
│               (Backend Integration)                  │
└─────────────────────────────────────────────────────┘
```

## 🔌 API Endpoints

### Autenticación

| Método | Endpoint              | Descripción           | Auth Required |
|--------|-----------------------|-----------------------|---------------|
| POST   | `/api/auth/register`  | Registrar nuevo usuario | ❌           |
| POST   | `/api/auth/login`     | Iniciar sesión        | ❌           |
| GET    | `/api/auth/profile`   | Obtener perfil        | ✅           |

### Ejemplos de Uso

#### Registrar Usuario

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "password123"
  }'
```

#### Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "password123"
  }'
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "usuario@ejemplo.com"
  }
}
```

#### Obtener Perfil

```bash
curl -X GET http://localhost:4000/api/auth/profile \
  -H "Authorization: Bearer TU_TOKEN_JWT"
```

## 🧪 Testing

```bash
# Backend tests
cd omi-back
npm test

# Frontend tests
cd omi-front
npm test
```

## 📝 Scripts Disponibles

### Backend (`omi-back/`)

| Script        | Descripción                          |
|---------------|--------------------------------------|
| `npm run dev` | Inicia servidor en modo desarrollo   |
| `npm run build` | Compila TypeScript a JavaScript    |
| `npm start`   | Inicia servidor de producción        |
| `npm test`    | Ejecuta tests                        |

### Frontend (`omi-front/`)

| Script        | Descripción                          |
|---------------|--------------------------------------|
| `npm run dev` | Inicia Next.js con Turbopack         |
| `npm run build` | Crea build de producción           |
| `npm start`   | Inicia servidor de producción        |
| `npm run lint` | Ejecuta ESLint                      |

## 🔒 Seguridad

- ✅ Passwords hasheados con bcrypt (10 rounds)
- ✅ JWT con expiración configurable
- ✅ CORS configurado correctamente
- ✅ Variables de entorno para datos sensibles
- ✅ Validación de datos con Zod
- ✅ Headers de seguridad HTTP

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva característica'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Convención de Commits

- `Add:` Nueva funcionalidad
- `Fix:` Corrección de bugs
- `Update:` Actualización de código existente
- `Refactor:` Refactorización de código
- `Docs:` Cambios en documentación
- `Style:` Cambios de formato (no afectan la funcionalidad)
- `Test:` Añadir o modificar tests

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 👥 Autor

**Tu Nombre** - [GitHub](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - El framework de React
- [Express.js](https://expressjs.com/) - Framework web minimalista
- [MongoDB](https://www.mongodb.com/) - Base de datos NoSQL
- [TailwindCSS](https://tailwindcss.com/) - Framework de CSS
- [Shadcn/ui](https://ui.shadcn.com/) - Componentes UI reutilizables

---

<div align="center">

**[⬆ Volver arriba](#-omi---plataforma-de-películas)**

Hecho con ❤️ usando Next.js y Express.js

</div>

