# 🚀 Inicio Rápido - OMI Backend

Guía de 5 minutos para poner en marcha el backend.

## 📦 1. Instalar Dependencias

```bash
npm install
```

## ⚙️ 2. Configurar Variables de Entorno

El archivo `.env` ya está configurado con:
- ✅ MongoDB Atlas URI
- ✅ Resend API Key
- ✅ Pexels API Key
- ✅ JWT Secret
- ✅ CORS configurado

**No necesitas hacer nada más** ✨

## 🚀 3. Iniciar Servidor

```bash
npm run dev
```

Deberías ver:
```
🔌 Connecting to MongoDB Atlas...
🏓 Pinged your deployment. You successfully connected to MongoDB!
Server running on port 3001
```

## 🧪 4. Probar que Todo Funciona

En **otra terminal**, ejecuta:

```bash
npm test
```

Si ves esto, ¡TODO FUNCIONA! 🎉

```
✓ TODOS LOS TESTS PASARON EXITOSAMENTE! 🎉

Estadísticas:
  ✓ Tests exitosos: 12/12
  ⏱  Tiempo total: ~15s

Componentes probados:
  ✓ Sistema de Autenticación (JWT)
  ✓ Gestión de Usuarios (CRUD)
  ✓ Recuperación de Contraseña
  ✓ Sistema de Videos (Pexels)
  ✓ Validaciones y Seguridad
```

---

## 🎯 Endpoints Listos para Usar

### Autenticación
```bash
POST   /api/auth/register       # Registrar usuario
POST   /api/auth/login          # Iniciar sesión
GET    /api/auth/profile        # Ver perfil (requiere token)
PUT    /api/auth/profile        # Actualizar perfil (requiere token)
DELETE /api/auth/account        # Eliminar cuenta (requiere token)
POST   /api/auth/forgot-password # Recuperar contraseña
POST   /api/auth/reset-password  # Restablecer contraseña
```

### Videos
```bash
GET /api/videos/search?query=nature     # Buscar videos
GET /api/videos/popular                 # Videos populares
GET /api/videos/:id                     # Video específico
```

---

## 📝 Ejemplo Rápido

### 1. Registrar un usuario

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "MiPassword123!",
    "firstName": "Juan",
    "lastName": "Pérez",
    "age": 28
  }'
```

**Respuesta:**
```json
{
  "message": "User registered successfully",
  "data": {
    "user": { /* datos del usuario */ },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Buscar videos

```bash
curl "http://localhost:3001/api/videos/search?query=ocean&per_page=5"
```

---

## 🔧 Comandos Útiles

```bash
# Iniciar servidor
npm run dev

# Ejecutar todos los tests
npm test

# Limpiar caché y reiniciar
npm run clean:all && npm run dev

# Compilar para producción
npm run build:prod

# Iniciar en producción
npm start
```

---

## 📚 Más Información

- **Tests detallados:** Ver `TESTING.md`
- **Ejemplos de API:** Ver `API_EXAMPLES.md`
- **Documentación completa:** Ver `README.md`
- **Historial de cambios:** Ver `CHANGELOG.md`

---

## 🆘 Ayuda Rápida

### Problema: Servidor no arranca
```bash
npm run clean:all
npm install
npm run dev
```

### Problema: Tests fallan
1. Verifica que el servidor esté corriendo
2. Verifica MongoDB Atlas esté conectado
3. Ejecuta: `npm run test:complete:bash`

### Problema: Errores de compilación
```bash
rm -rf node_modules dist .ts-node
npm install
npm run dev
```

---

## ✅ Checklist

- [x] Dependencias instaladas
- [x] Variables de entorno configuradas (.env)
- [x] MongoDB Atlas conectado
- [x] Servidor corriendo (puerto 3001)
- [x] Tests pasando (npm test)

**¡Listo para desarrollar!** 🎉

