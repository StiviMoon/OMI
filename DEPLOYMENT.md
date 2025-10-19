# 🚀 Guía de Deployment - Proyecto OMI

Guía completa para compilar y desplegar el proyecto en producción.

---

## 📦 Build Completo del Proyecto

### Opción 1: Build Automático (Recomendado)

```bash
# En la raíz del proyecto
./build-all.sh
```

Este script:
1. ✅ Limpia builds anteriores
2. ✅ Compila el backend (TypeScript → JavaScript)
3. ✅ Compila el frontend (Next.js optimizado)
4. ✅ Muestra resumen de resultados

**Resultado:**
```
✓ Backend: omi-back/dist/
✓ Frontend: omi-front/.next/
```

---

### Opción 2: Build Manual

#### Backend

```bash
cd omi-back

# Limpiar y compilar
npm run build:prod

# O paso a paso
npm run clean    # Elimina dist/
npm run build    # Compila TypeScript
```

**Output:** `omi-back/dist/`

#### Frontend

```bash
cd omi-front

# Compilar
npm run build
```

**Output:** `omi-front/.next/`

---

## 🏃 Iniciar en Producción

### Opción 1: Inicio Automático

```bash
# En la raíz del proyecto
./start-all.sh
```

Este script:
1. ✅ Verifica que los builds existan
2. ✅ Inicia backend en puerto 3001
3. ✅ Inicia frontend en puerto 3000
4. ✅ Guarda logs en archivos
5. ✅ Guarda PIDs para control

**Para ver logs:**
```bash
tail -f backend.log
tail -f frontend.log
```

**Para detener:**
```bash
./stop-all.sh
```

---

### Opción 2: Inicio Manual

#### Backend

```bash
cd omi-back
npm start
# Corre en http://localhost:3001
```

#### Frontend

```bash
cd omi-front
npm start
# Corre en http://localhost:3000
```

---

## ⚙️ Configuración para Producción

### Backend (.env)

```env
# CAMBIAR PARA PRODUCCIÓN
NODE_ENV=production
PORT=3001

# Security
JWT_SECRET=CAMBIA_ESTO_POR_UNA_CLAVE_SUPER_SEGURA_RANDOM

# Database
MONGODB_URI=tu_mongodb_atlas_uri_produccion

# CORS - Dominio de tu frontend
CORS_ORIGIN=https://tudominio.com

# Resend - Verifica tu dominio primero
RESEND_API_KEY=tu_api_key
EMAIL_FROM=noreply@tudominio.com
EMAIL_FROM_NAME=OMI
RESET_PASSWORD_URL=https://tudominio.com/reset-password

# Pexels
PEXELS_API_KEY=tu_api_key
```

### Frontend (.env.local → .env.production)

```bash
# Crear archivo para producción
cp .env.local .env.production

# Editar .env.production
NEXT_PUBLIC_API_URL=https://api.tudominio.com
```

---

## 🌐 Deployment en Servidores

### Opción 1: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend en Vercel

1. **Conectar repo a Vercel:**
   ```bash
   vercel
   ```

2. **Configurar:**
   - Root Directory: `omi-front`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Variables de entorno:**
   ```
   NEXT_PUBLIC_API_URL=https://tu-backend.railway.app
   ```

#### Backend en Railway

1. **Conectar repo a Railway**

2. **Configurar:**
   - Root Directory: `omi-back`
   - Build Command: `npm run build:prod`
   - Start Command: `npm start`

3. **Variables de entorno:** (copiar del .env)

---

### Opción 2: VPS (Ubuntu/Debian)

#### 1. Preparar Servidor

```bash
# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 (Process Manager)
sudo npm install -g pm2
```

#### 2. Subir Proyecto

```bash
# Clonar repo
git clone tu-repo.git
cd OMI

# Instalar dependencias
cd omi-back && npm install && cd ..
cd omi-front && npm install && cd ..

# Compilar
./build-all.sh
```

#### 3. Configurar PM2

```bash
# Backend
cd omi-back
pm2 start npm --name "omi-backend" -- start

# Frontend
cd omi-front
pm2 start npm --name "omi-frontend" -- start

# Guardar configuración
pm2 save
pm2 startup
```

#### 4. Nginx como Reverse Proxy

```nginx
# /etc/nginx/sites-available/omi

# Backend
server {
    listen 80;
    server_name api.tudominio.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activar configuración
sudo ln -s /etc/nginx/sites-available/omi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### Opción 3: Docker

#### Backend Dockerfile

```dockerfile
# omi-back/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3001

CMD ["npm", "start"]
```

#### Frontend Dockerfile

```dockerfile
# omi-front/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY .next ./.next
COPY public ./public
COPY next.config.ts ./

EXPOSE 3000

CMD ["npm", "start"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./omi-back
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
    restart: unless-stopped

  frontend:
    build: ./omi-front
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3001
    depends_on:
      - backend
    restart: unless-stopped
```

```bash
# Construir e iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

---

## ✅ Checklist Pre-Producción

### Seguridad

- [ ] Cambiar JWT_SECRET a valor aleatorio y seguro
- [ ] Configurar CORS con dominio real
- [ ] Verificar dominio en Resend
- [ ] Cambiar NODE_ENV=production
- [ ] Revisar que no haya console.log sensibles

### Base de Datos

- [ ] MongoDB Atlas configurado
- [ ] Backup automático activado
- [ ] Índices creados (se crean automáticamente)

### Email

- [ ] Dominio verificado en Resend
- [ ] EMAIL_FROM con tu dominio
- [ ] Probar envío de emails

### Testing

- [ ] Ejecutar todos los tests: `cd omi-back && npm test`
- [ ] Probar endpoints manualmente
- [ ] Verificar flujo completo en staging

---

## 📊 Monitoreo

### PM2 (si usas VPS)

```bash
# Ver estado
pm2 status

# Ver logs
pm2 logs omi-backend
pm2 logs omi-frontend

# Reiniciar
pm2 restart all

# Monitoreo
pm2 monit
```

### Logs

```bash
# Backend
tail -f omi-back/logs/*.log

# Frontend  
tail -f omi-front/.next/trace

# Con script automático
tail -f backend.log
tail -f frontend.log
```

---

## 🔧 Comandos Útiles

### Desarrollo

```bash
# Backend
cd omi-back && npm run dev

# Frontend
cd omi-front && npm run dev

# Tests
cd omi-back && npm test
```

### Producción

```bash
# Compilar todo
./build-all.sh

# Iniciar todo
./start-all.sh

# Detener todo
./stop-all.sh

# Ver logs
tail -f backend.log
tail -f frontend.log
```

---

## 📝 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `build-all.sh` | Compila backend + frontend |
| `start-all.sh` | Inicia en producción |
| `stop-all.sh` | Detiene todos los servicios |

---

## 🆘 Troubleshooting

### Puerto en uso

```bash
# Liberar puerto 3001
lsof -ti:3001 | xargs kill -9

# Liberar puerto 3000
lsof -ti:3000 | xargs kill -9
```

### Build falla

```bash
# Limpiar todo
cd omi-back && npm run clean && cd ..
cd omi-front && rm -rf .next && cd ..

# Reinstalar dependencias
cd omi-back && rm -rf node_modules && npm install && cd ..
cd omi-front && rm -rf node_modules && npm install && cd ..

# Compilar de nuevo
./build-all.sh
```

### Error de tipos

```bash
# Backend
cd omi-back && npx tsc --noEmit

# Frontend
cd omi-front && npx tsc --noEmit
```

---

**¡Proyecto listo para producción!** 🎉

