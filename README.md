# 🎬 OMI - Plataforma de Videos

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)

**Sistema completo de gestión de usuarios y videos con autenticación JWT, recuperación de contraseña y Pexels API**

[Backend](./omi-back) · [Frontend](./omi-front) · [Deployment](./DEPLOYMENT.md)

</div>

---

## 🏗️ Estructura del Proyecto

```
OMI/
├── omi-back/          # Backend (Express + TypeScript + MongoDB)
│   ├── src/           # Código fuente (Clean Architecture)
│   ├── dist/          # Código compilado
│   └── tests/         # 14 tests automatizados
│
├── omi-front/         # Frontend (Next.js + TypeScript + TailwindCSS)
│   ├── src/           # Código fuente
│   └── .next/         # Build de producción
│
└── Scripts de utilidad
    ├── build-all.sh   # Compilar todo
    ├── start-all.sh   # Iniciar en producción
    └── stop-all.sh    # Detener servicios
```

---

## ⚡ Inicio Rápido

### Desarrollo (2 comandos)

```bash
# Terminal 1: Backend
cd omi-back && npm install && npm run dev

# Terminal 2: Frontend
cd omi-front && npm install && npm run dev
```

**URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Producción (1 comando)

```bash
./build-all.sh    # Compilar
./start-all.sh    # Iniciar
```

---

## ✨ Funcionalidades

### 🔐 Sistema de Autenticación Completo
- ✅ Registro (nombre, apellido, edad, email, contraseña)
- ✅ Login con JWT (expira en 24h)
- ✅ Ver y editar perfil
- ✅ Cambiar contraseña (con verificación)
- ✅ Recuperar contraseña por email
- ✅ Eliminar cuenta (con confirmación)

### 📧 Sistema de Emails
- ✅ Integración con Resend
- ✅ Templates HTML profesionales
- ✅ Modo desarrollo: emails a `johan.steven.rodriguez@correounivalle.edu.co`
- ✅ Tokens seguros con expiración (1 hora)

### 🎬 Sistema de Videos
- ✅ Búsqueda de videos (Pexels API)
- ✅ Filtros avanzados (orientación, tamaño, duración)
- ✅ Videos populares
- ✅ Obtener por ID

### 🔒 Seguridad
- Contraseñas hasheadas (bcrypt, 12 rounds)
- Tokens JWT con expiración
- Validaciones en cliente y servidor
- Middleware de autenticación
- CORS configurado

---

## 🧪 Testing

```bash
cd omi-back
npm test
```

**Resultado:**
```
✓ 14/15 tests pasando
⏱ ~14 segundos
✅ Auth, CRUD, Recuperación, Videos
```

---

## 📡 API Endpoints (11 total)

### Autenticación (7)
```
POST   /api/auth/register         
POST   /api/auth/login            
GET    /api/auth/profile          # Requiere token
PUT    /api/auth/profile          # Requiere token
DELETE /api/auth/account          # Requiere token
POST   /api/auth/forgot-password  
POST   /api/auth/reset-password   
```

### Videos (3)
```
GET /api/videos/search?query=ocean    
GET /api/videos/popular               
GET /api/videos/:id                   
```

**Ver ejemplos de uso:** [`omi-back/API_EXAMPLES.md`](./omi-back/API_EXAMPLES.md)

---

## 🛠️ Tecnologías

<table>
<tr>
<td width="50%">

### Backend
- Node.js + Express
- TypeScript
- MongoDB Atlas
- JWT + bcryptjs
- Resend (emails)
- Pexels API
- Clean Architecture

</td>
<td width="50%">

### Frontend
- Next.js 15
- React 19
- TypeScript
- TailwindCSS
- shadcn/ui
- Lucide Icons

</td>
</tr>
</table>

---

## 📚 Documentación

### Backend (omi-back/)
- [`README.md`](./omi-back/README.md) - Documentación completa del backend
- [`API_EXAMPLES.md`](./omi-back/API_EXAMPLES.md) - Ejemplos prácticos con curl
- [`TESTING.md`](./omi-back/TESTING.md) - Guía completa de testing

### Frontend (omi-front/)
- [`README.md`](./omi-front/README.md) - Documentación del frontend
- [`FRONTEND_GUIDE.md`](./omi-front/FRONTEND_GUIDE.md) - Guía de componentes

### Deployment
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) - Guía para producción (VPS, Vercel, Docker)

---

## 🔧 Scripts Útiles

### Raíz
```bash
./build-all.sh    # Compilar backend + frontend
./start-all.sh    # Iniciar en producción
./stop-all.sh     # Detener servicios
```

### Backend
```bash
npm run dev         # Desarrollo
npm run build:prod  # Compilar
npm start           # Producción
npm test            # Tests
```

### Frontend
```bash
npm run dev    # Desarrollo
npm run build  # Compilar
npm start      # Producción
```

---

## ⚙️ Configuración

### URLs de Deployment

```
🚀 Backend:  https://omi-g653.onrender.com
🎨 Frontend: https://omi-front.vercel.app
```

### Variables de Entorno

**Backend:** Copia `.env.example` a `.env` y completa:
```env
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret
RESEND_API_KEY=re_xxx
PEXELS_API_KEY=xxx
CORS_ORIGIN=http://localhost:3000
DEV_EMAIL=johan.steven.rodriguez@correounivalle.edu.co
```

**Frontend:** Crea `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Ver guía completa:** [`ENV_GUIDE.md`](./ENV_GUIDE.md)

---

## 📊 Estadísticas

- **Endpoints:** 11
- **Tests:** 14 automatizados
- **Componentes:** 15+
- **Líneas de código:** ~4000+
- **Casos de uso:** 6
- **Clean Architecture:** ✅

---

## 🚀 Empezar a Desarrollar

```bash
# 1. Clonar/Navegar al proyecto
cd OMI

# 2. Backend
cd omi-back
npm install
npm run dev       # Puerto 3001

# 3. Frontend (otra terminal)
cd omi-front
npm install
npm run dev       # Puerto 3000

# 4. Abrir navegador
http://localhost:3000

# 5. Probar
cd omi-back
npm test          # ✅ 14 tests
```

---

## 📖 Flujo de Usuario Completo

1. **Registrarse** → Nombre, Apellido, Edad, Email, Contraseña
2. **Login** → Acceder al sistema
3. **Ver Videos** → Buscar, filtrar, reproducir
4. **Gestionar Cuenta** → Editar perfil, cambiar contraseña
5. **Recuperar Contraseña** → Email con link de recuperación
6. **Eliminar Cuenta** → Con confirmación y contraseña

---

## 🔗 Enlaces Útiles

- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
- **Resend:** https://resend.com
- **Pexels API:** https://www.pexels.com/api
- **Next.js:** https://nextjs.org
- **Express:** https://expressjs.com

---

## 📝 Licencia

ISC

---

<div align="center">

**¿Necesitas ayuda?** Consulta la documentación en cada subcarpeta

[Backend Docs](./omi-back) · [Frontend Docs](./omi-front) · [Deployment Guide](./DEPLOYMENT.md)

---

Desarrollado con ❤️ usando **Clean Architecture** y **mejores prácticas**

</div>
