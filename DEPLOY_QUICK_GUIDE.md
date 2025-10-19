# 🚀 Guía Rápida de Deployment

Instrucciones para desplegar en Render (Backend) y Vercel (Frontend).

---

## 🔴 Render - Backend

### URLs Actuales
- **Servicio:** https://omi-g653.onrender.com
- **API:** https://omi-g653.onrender.com/api

### Pasos para Deploy/Actualizar

1. **Push a tu repositorio:**
   ```bash
   git add .
   git commit -m "Update backend"
   git push origin main
   ```

2. **Render detectará automáticamente** el push y redesplegará

3. **Variables de entorno en Render Dashboard:**
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://johanstevenrodriguez_db_user:ubn71uzOMCXw8g0n@omi-s.uuy2hiu.mongodb.net/OMI-S?retryWrites=true&w=majority&appName=OMI-S
   DB_NAME=OMI-S
   JWT_SECRET=omi-production-super-secret-key-change-this-to-random-string-2025
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=https://omi-front.vercel.app
   PEXELS_API_KEY=AQ0AoBs5IOWrCwfGr81uCForyE7ECDZb0pHOznHAB2nvoVPkcU1k5wrr
   RESEND_API_KEY=re_cfUW54F4_AsZC1vqjgBddfWjpEL3z9xix
   EMAIL_FROM=onboarding@resend.dev
   EMAIL_FROM_NAME=OMI
   RESET_PASSWORD_URL=https://omi-front.vercel.app/reset-password
   ```

4. **Configuración del servicio:**
   - **Root Directory:** `omi-back`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

---

## ⚡ Vercel - Frontend

### URLs Actuales
- **Producción:** https://omi-front.vercel.app

### Pasos para Deploy/Actualizar

1. **Push a tu repositorio:**
   ```bash
   git add .
   git commit -m "Update frontend"
   git push origin main
   ```

2. **Vercel detectará automáticamente** el push y redesplegará

3. **Variables de entorno en Vercel Dashboard:**
   ```
   NEXT_PUBLIC_API_URL=https://omi-g653.onrender.com
   ```

4. **Configuración del proyecto:**
   - **Root Directory:** `omi-front`
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

---

## 🔄 Workflow de Actualización

### Opción 1: Automática (Recomendada)

```bash
# 1. Hacer cambios en el código
# 2. Commit y push
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main

# 3. Render y Vercel despliegan automáticamente
# ✅ Listo!
```

### Opción 2: Manual desde Dashboard

1. **Render:** Deploy → Manual Deploy → Latest Commit
2. **Vercel:** Deployments → Redeploy

---

## 🧪 Verificar Deployment

### Backend (Render)

```bash
# Verificar que está corriendo
curl https://omi-g653.onrender.com/

# Debería devolver:
# {"message":"OMI API - Authentication & Video Services",...}
```

### Frontend (Vercel)

```bash
# Abrir en navegador
https://omi-front.vercel.app

# Debería cargar la página principal
```

### Probar API desde Frontend en Producción

1. Ir a https://omi-front.vercel.app
2. Click "Iniciar Sesión" → "Regístrate"
3. Completar formulario
4. Debería registrar correctamente y redirigir a /videos

---

## 📝 Configuraciones Importantes

### MongoDB Atlas

**Network Access:**
- Permitir acceso desde cualquier IP: `0.0.0.0/0`
- O agregar las IPs de Render

**Database Access:**
- Usuario: `johanstevenrodriguez_db_user`
- Contraseña: Ya configurada en MONGODB_URI

### Resend

**Modo Desarrollo:**
- Emails se envían a: `johan.steven.rodriguez@correounivalle.edu.co`

**Modo Producción:**
- Emails se envían al usuario real
- **Para enviar a cualquier email:** Verifica tu dominio en https://resend.com/domains

### CORS

**Muy importante:** El `CORS_ORIGIN` en el backend DEBE coincidir exactamente con el dominio del frontend:

```env
# Correcto
CORS_ORIGIN=https://omi-front.vercel.app

# Incorrecto
CORS_ORIGIN=https://omi-front.vercel.app/    ❌ (con barra)
CORS_ORIGIN=http://omi-front.vercel.app      ❌ (http en vez de https)
```

---

## 🔍 Debugging en Producción

### Ver logs en Render

1. Dashboard → tu servicio
2. Tab "Logs"
3. Ver en tiempo real

### Ver logs en Vercel

1. Dashboard → tu proyecto
2. Deployment → Ver deployment
3. Tab "Logs"

---

## ⚠️ Notas Importantes

### Render

- ✅ Deploy automático desde GitHub
- ⏱️ Primera petición puede tardar (cold start)
- 💤 En plan gratuito se duerme después de 15 min de inactividad
- 🔄 Se despierta automáticamente con la primera petición

### Vercel

- ✅ Deploy automático desde GitHub
- ⚡ Edge network (muy rápido)
- 🌍 CDN global
- 💰 Plan gratuito muy generoso

---

## 🎯 Próximos Pasos para Mejorar

### Para Producción Real

1. **Verificar dominio en Resend:**
   - https://resend.com/domains
   - Cambiar `EMAIL_FROM` a tu dominio

2. **Generar nuevo JWT_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

3. **Dominio personalizado:**
   - Backend: Configurar en Render
   - Frontend: Configurar en Vercel

4. **SSL/HTTPS:**
   - Render y Vercel lo incluyen gratis ✅

---

## 📚 Recursos

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas:** https://docs.atlas.mongodb.com
- **Resend Docs:** https://resend.com/docs

---

**Última actualización:** 2025-10-19

