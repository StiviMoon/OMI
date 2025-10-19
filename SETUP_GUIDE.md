# Guía de Configuración - OMI Project

## Problema: "Failed to fetch" en el Frontend

Este error ocurre porque el frontend no puede conectarse al backend. Aquí está la solución paso a paso:

## Solución

### 1. Configurar Variables de Entorno del Frontend

Crea el archivo `.env.local` en la carpeta `omi-front`:

```bash
cd /home/steven/Documentos/Proyectos/OMI/omi-front
```

Crea el archivo con el siguiente contenido:

```bash
cat > .env.local << 'EOF'
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001
EOF
```

### 2. Configurar Variables de Entorno del Backend

Crea el archivo `.env` en la carpeta `omi-back`:

```bash
cd /home/steven/Documentos/Proyectos/OMI/omi-back
```

Crea el archivo con el siguiente contenido (necesitarás obtener un API key de Pexels):

```bash
cat > .env << 'EOF'
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/OMI-S
DB_NAME=OMI-S

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Pexels API Configuration
# Get your API key from: https://www.pexels.com/api/
PEXELS_API_KEY=TU_PEXELS_API_KEY_AQUI
EOF
```

### 3. Obtener Pexels API Key

1. Ve a: https://www.pexels.com/api/
2. Regístrate o inicia sesión
3. Genera una API key gratuita
4. Copia la API key y reemplaza `TU_PEXELS_API_KEY_AQUI` en el archivo `.env` del backend

### 4. Reiniciar los Servidores

Después de crear los archivos `.env`, debes reiniciar ambos servidores:

#### Backend:
- Presiona `Ctrl+C` en la terminal donde corre el backend
- Ejecuta: `npm run dev`

#### Frontend:
- Presiona `Ctrl+C` en la terminal donde corre el frontend
- Ejecuta: `npm run dev`

### 5. Limpiar Caché del Navegador

1. Abre las DevTools del navegador (F12)
2. Haz clic derecho en el botón de recargar
3. Selecciona "Vaciar caché y recargar"

O simplemente presiona: `Ctrl+Shift+R` (Linux/Windows) o `Cmd+Shift+R` (Mac)

## Verificación

Para verificar que todo funciona:

### Verificar que los servidores están corriendo:

```bash
# Verificar backend
curl http://localhost:3001/api/videos/popular?page=1&per_page=2

# Debería devolver un JSON con videos de Pexels
```

### Verificar que el frontend puede ver las variables de entorno:

1. Abre el navegador en `http://localhost:3000`
2. Abre la consola del navegador (F12)
3. Deberías ver logs como:
   - `🔍 Fetching URL: http://localhost:3001/api/videos/popular?page=1&per_page=15`
   - `📦 Raw Response: ...`

## Solución de Problemas

### Si aún ves "Failed to fetch":

1. Verifica que ambos servidores estén corriendo:
   ```bash
   # Verificar puertos en uso
   ss -tuln | grep -E '(3000|3001)'
   ```
   Deberías ver ambos puertos (3000 y 3001) en LISTEN.

2. Verifica que el backend tenga una Pexels API key válida:
   ```bash
   cd /home/steven/Documentos/Proyectos/OMI/omi-back
   grep PEXELS_API_KEY .env
   ```

3. Verifica que el frontend tenga la variable de entorno:
   ```bash
   cd /home/steven/Documentos/Proyectos/OMI/omi-front
   cat .env.local
   ```

4. Si el problema persiste, reinicia completamente:
   - Detén ambos servidores (Ctrl+C)
   - Reinicia el backend: `cd omi-back && npm run dev`
   - Reinicia el frontend: `cd omi-front && npm run dev`
   - Limpia el caché del navegador

### Error: "Pexels API error"

Si ves este error, significa que el backend está funcionando pero la API key de Pexels es inválida o está vacía. Sigue los pasos de la sección 3 para obtener una API key válida.

## Cambios Realizados

Los siguientes archivos han sido modificados para mejorar la conexión frontend-backend:

1. **`omi-front/next.config.ts`**: Añadida configuración de variables de entorno
2. **`omi-front/src/lib/api/videos.ts`**: Mejorado el manejo de errores y logs de debugging

Estos cambios proporcionan:
- Mejor manejo de errores
- Logs detallados para debugging
- Configuración explícita de CORS mode
- Mensajes de error más descriptivos

