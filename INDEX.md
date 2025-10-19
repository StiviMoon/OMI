# 📑 Índice del Proyecto OMI

Navegación rápida a toda la documentación y recursos del proyecto.

---

## 📚 Documentación Principal

### 🏠 Raíz del Proyecto
- **[README.md](./README.md)** ⭐ - Documentación principal, inicio rápido
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guía completa de deployment (VPS, Vercel, Docker)

### 🔧 Backend (omi-back/)
- **[README.md](./omi-back/README.md)** - Documentación completa del backend
- **[API_EXAMPLES.md](./omi-back/API_EXAMPLES.md)** - Ejemplos prácticos con curl
- **[TESTING.md](./omi-back/TESTING.md)** - Guía de testing (14 tests automatizados)

### 🎨 Frontend (omi-front/)
- **[README.md](./omi-front/README.md)** - Documentación del frontend
- **[FRONTEND_GUIDE.md](./omi-front/FRONTEND_GUIDE.md)** - Guía de componentes de autenticación

---

## 🔧 Scripts del Proyecto

### Scripts de Deployment (Raíz)
```bash
./build-all.sh    # Compilar backend + frontend
./start-all.sh    # Iniciar en producción (background)
./stop-all.sh     # Detener todos los servicios
```

### Scripts de Test (Backend)
```bash
cd omi-back
npm test          # Test completo (test-complete-api.ts)
npm run test:flow # Test de usuarios (test-user-flow.ts)
```

---

## 🚀 Comandos Rápidos

### Desarrollo
```bash
# Backend
cd omi-back && npm run dev

# Frontend
cd omi-front && npm run dev
```

### Producción
```bash
# Compilar todo
./build-all.sh

# Iniciar todo
./start-all.sh

# Detener todo
./stop-all.sh
```

### Testing
```bash
cd omi-back && npm test
```

---

## 📂 Estructura de Archivos Importantes

```
OMI/
├── 📄 README.md               ⭐ Empieza aquí
├── 📄 DEPLOYMENT.md           Guía de producción
├── 📄 INDEX.md                Este archivo
│
├── 🔧 build-all.sh            Compilar proyecto
├── 🔧 start-all.sh            Iniciar producción
├── 🔧 stop-all.sh             Detener servicios
│
├── 📁 omi-back/               Backend
│   ├── 📄 README.md           Docs del backend
│   ├── 📄 API_EXAMPLES.md     Ejemplos de API
│   ├── 📄 TESTING.md          Guía de tests
│   ├── 🧪 test-complete-api.ts  Tests completos
│   ├── 🧪 test-user-flow.ts     Tests de usuarios
│   └── 📁 src/                Código fuente
│
└── 📁 omi-front/              Frontend
    ├── 📄 README.md           Docs del frontend
    ├── 📄 FRONTEND_GUIDE.md   Guía de componentes
    └── 📁 src/                Código fuente
```

---

## 🎯 Guías por Tema

### Para Desarrolladores Nuevos
1. Lee [`README.md`](./README.md) - Información general
2. Lee [`omi-back/README.md`](./omi-back/README.md) - Backend
3. Lee [`omi-front/FRONTEND_GUIDE.md`](./omi-front/FRONTEND_GUIDE.md) - Frontend

### Para Testing
1. [`omi-back/TESTING.md`](./omi-back/TESTING.md) - Guía completa de tests
2. Ejecuta: `cd omi-back && npm test`

### Para API Development
1. [`omi-back/API_EXAMPLES.md`](./omi-back/API_EXAMPLES.md) - Ejemplos de todos los endpoints
2. [`omi-back/README.md#endpoints`](./omi-back/README.md) - Lista de endpoints

### Para Deployment
1. [`DEPLOYMENT.md`](./DEPLOYMENT.md) - Todas las opciones de deployment
2. Usa: `./build-all.sh` → `./start-all.sh`

---

## 📊 Estadísticas

- **Documentación:** 7 archivos MD + este índice
- **Scripts útiles:** 3 shell scripts + 2 test scripts
- **Endpoints:** 11 (7 auth + 3 videos + 1 root)
- **Tests:** 14 automatizados
- **Componentes:** 15+

---

## 🔗 Enlaces Externos

- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
- **Resend:** https://resend.com
- **Pexels API:** https://www.pexels.com/api

---

**Última actualización:** 2025-10-19

