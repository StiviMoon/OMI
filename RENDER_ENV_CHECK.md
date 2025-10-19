# ✅ Variables de Entorno para Render

## 📋 Checklist de Variables Requeridas

Verifica que en **Render** (https://dashboard.render.com) tengas estas variables configuradas:

### 🔐 **Configuración de Producción**

```env
# Server
NODE_ENV=production
PORT=3001

# Database
MONGODB_URI=mongodb+srv://johanstevenrodriguez_db_user:ubn71uzOMCXw8g0n@omi-s.uuy2hiu.mongodb.net/OMI-S?retryWrites=true&w=majority&appName=OMI-S
DB_NAME=OMI-S

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=https://omi-front.vercel.app

# Pexels API
PEXELS_API_KEY=AQ0AoBs5IOWrCwfGr81uCForyE7ECDZb0pHOznHAB2nvoVPkcU1k5wrr

# Resend Email Service
RESEND_API_KEY=re_cfUW54F4_AsZC1vqjgBddfWjpEL3z9xix
EMAIL_FROM=onboarding@resend.dev
EMAIL_FROM_NAME=OMI
RESET_PASSWORD_URL=https://omi-front.vercel.app/reset-password

# ⚠️ IMPORTANTE: Email para recibir las notificaciones en producción
# Mientras uses onboarding@resend.dev, TODOS los emails irán a esta dirección
DEV_EMAIL=johan.steven.rodriguez@correounivalle.edu.co
```

---

## 🔧 **Cómo verificar/actualizar en Render:**

1. Ve a https://dashboard.render.com
2. Selecciona tu servicio backend (`omi-g653`)
3. Ve a **Environment**
4. Verifica que **DEV_EMAIL** exista con el valor: `johan.steven.rodriguez@correounivalle.edu.co`

---

## ✨ **Cómo funciona ahora:**

### **En Desarrollo (localhost):**
```
Usuario solicita reset → Email enviado a: johan.steven.rodriguez@correounivalle.edu.co
Asunto: [DEV] Recuperar Contraseña - Usuario: usuario@example.com
```

### **En Producción (Render + onboarding@resend.dev):**
```
Usuario solicita reset → Email enviado a: johan.steven.rodriguez@correounivalle.edu.co
Asunto: [PROD] Recuperar Contraseña - Usuario: usuario@example.com
```

### **En Producción (con dominio verificado):**
```
Usuario solicita reset → Email enviado a: usuario@example.com
Asunto: Recuperación de Contraseña - OMI
```

---

## 📝 **Notas:**

1. **¿Por qué enviamos a johan...?**
   - Resend con `onboarding@resend.dev` solo permite enviar a **emails verificados**
   - `johan.steven.rodriguez@correounivalle.edu.co` está verificado en tu cuenta de Resend

2. **¿Cuándo cambiar?**
   - Cuando tengas un **dominio propio** (ej: `omi.com`)
   - Verifica el dominio en Resend
   - Cambia `EMAIL_FROM` de `onboarding@resend.dev` a `noreply@tudominio.com`
   - El sistema detectará automáticamente y enviará a cada usuario

3. **¿Cómo saber el usuario original?**
   - El email incluye en el asunto: `Usuario: usuario@example.com`
   - En el cuerpo del email se muestra el email original
   - Los logs de Render muestran: `📧 Usuario original: usuario@example.com`

---

## 🚀 **Después de actualizar las variables:**

1. Render redesplegará automáticamente
2. O fuerza un redeploy manual desde el dashboard
3. Prueba la recuperación de contraseña desde: https://omi-front.vercel.app

---

✅ **Fix aplicado:** Ahora el sistema detecta automáticamente si usas `onboarding@resend.dev` y redirige todos los emails a tu correo verificado, tanto en desarrollo como en producción.

