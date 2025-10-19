# ⚙️ Guía de Variables de Entorno - OMI

Configuración completa de variables de entorno para desarrollo y producción.

---

## 📁 Archivos de Entorno

### Backend (omi-back/)

```
.env              → Desarrollo (localhost)
.env.production   → Producción (Render)
.env.example      → Template/documentación
```

### Frontend (omi-front/)

```
.env.local        → Desarrollo (localhost)
.env.production   → Producción (Vercel)
.env.example      → Template/documentación
```

---

## 🔧 Backend - Variables de Entorno

### Servidor

```env
PORT=3001                    # Puerto del servidor
NODE_ENV=development         # development | production
```

### Base de Datos

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/OMI-S
DB_NAME=OMI-S
```

**Obtener MongoDB Atlas (gratis):** https://www.mongodb.com/cloud/atlas

### JWT (Autenticación)

```env
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=24h           # Tiempo de expiración del token
```

**Generar secret seguro:**
```bash
openssl rand -base64 32
# O en Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### CORS

```env
# Desarrollo
CORS_ORIGIN=http://localhost:3000

# Producción
CORS_ORIGIN=https://omi-front.vercel.app
```

### Pexels API (Videos)

```env
PEXELS_API_KEY=your_api_key
```

**Obtener API key (gratis):** https://www.pexels.com/api/

### Resend (Emails)

```env
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=onboarding@resend.dev      # Desarrollo
EMAIL_FROM_NAME=OMI
RESET_PASSWORD_URL=http://localhost:3000/reset-password
DEV_EMAIL=your.verified@email.com     # Solo desarrollo
```

**Obtener API key (gratis):** https://resend.com

**Para producción:**
1. Verifica tu dominio en [resend.com/domains](https://resend.com/domains)
2. Cambia `EMAIL_FROM` a `noreply@tudominio.com`

---

## 🎨 Frontend - Variables de Entorno

### API URL

```env
# Desarrollo
NEXT_PUBLIC_API_URL=http://localhost:3001

# Producción
NEXT_PUBLIC_API_URL=https://omi-g653.onrender.com
```

---

## 🚀 Configuración Actual del Proyecto

### URLs de Deployment

```
Backend (Render):  https://omi-g653.onrender.com
Frontend (Vercel): https://omi-front.vercel.app
```

### Desarrollo

**Backend:** `.env`
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
CORS_ORIGIN=http://localhost:3000
DEV_EMAIL=johan.steven.rodriguez@correounivalle.edu.co
```

**Frontend:** `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Producción

**Backend:** `.env.production`
```env
PORT=3001
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
CORS_ORIGIN=https://omi-front.vercel.app
RESET_PASSWORD_URL=https://omi-front.vercel.app/reset-password
```

**Frontend:** `.env.production`
```env
NEXT_PUBLIC_API_URL=https://omi-g653.onrender.com
```

---

## 📋 Checklist de Configuración

### Desarrollo

- [ ] Backend: Copiar `.env.example` a `.env`
- [ ] Backend: Completar valores en `.env`
- [ ] Frontend: Crear `.env.local` con API URL local
- [ ] Verificar MongoDB Atlas conectado
- [ ] Verificar Resend API key válida

### Producción

- [ ] Backend: Crear `.env.production` ✅ (ya creado)
- [ ] Frontend: Crear `.env.production` ✅ (ya creado)
- [ ] Cambiar `JWT_SECRET` a valor aleatorio seguro
- [ ] Configurar `CORS_ORIGIN` con dominio de producción ✅
- [ ] Verificar dominio en Resend (opcional)
- [ ] Actualizar `RESET_PASSWORD_URL` con dominio real ✅

---

## 🔐 Variables Sensibles

**⚠️ NUNCA COMMITEAR:**
- `.env`
- `.env.local`
- `.env.production`

**✅ SÍ COMMITEAR:**
- `.env.example`

Estos archivos ya están en `.gitignore`

---

## 🌍 Deployment en Plataformas

### Render (Backend)

En el dashboard de Render, configura estas variables de entorno:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=tu-secret-seguro
CORS_ORIGIN=https://omi-front.vercel.app
RESEND_API_KEY=re_xxx
PEXELS_API_KEY=xxx
EMAIL_FROM=onboarding@resend.dev
EMAIL_FROM_NAME=OMI
RESET_PASSWORD_URL=https://omi-front.vercel.app/reset-password
```

### Vercel (Frontend)

En el dashboard de Vercel, configura:

```
NEXT_PUBLIC_API_URL=https://omi-g653.onrender.com
```

---

## 🧪 Verificar Configuración

### Backend

```bash
cd omi-back
npm run dev
# Debería mostrar:
# ✅ Connected to MongoDB successfully
# Server running on port 3001
```

### Frontend

```bash
cd omi-front
npm run dev
# Debería abrir: http://localhost:3000
```

### Tests

```bash
cd omi-back
npm test
# ✅ 11/11 tests pasando
```

---

## 💡 Tips

1. **JWT_SECRET en producción:**
   ```bash
   # Genera uno nuevo:
   openssl rand -base64 32
   ```

2. **Verificar dominio en Resend:**
   - Ve a https://resend.com/domains
   - Agrega tu dominio
   - Sigue las instrucciones DNS
   - Cambia `EMAIL_FROM` a tu dominio

3. **CORS en producción:**
   - Asegúrate que `CORS_ORIGIN` coincida exactamente con tu dominio frontend
   - Incluye el protocolo (https://)
   - Sin barra al final

4. **MongoDB Atlas:**
   - Whitelist las IPs de Render en Network Access
   - O permite acceso desde cualquier IP (0.0.0.0/0)

---

## 🆘 Troubleshooting

### Error: CORS

```
Causa: CORS_ORIGIN no coincide con el frontend
Solución: Verificar CORS_ORIGIN en .env
```

### Error: MongoDB Connection

```
Causa: IP no está en whitelist
Solución: MongoDB Atlas → Network Access → Add IP
```

### Error: Email no se envía

```
Causa: Dominio no verificado en Resend
Solución: Usar onboarding@resend.dev o verificar dominio
```

---

**Última actualización:** 2025-10-19

