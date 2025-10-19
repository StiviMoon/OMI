# 🧪 Guía de Testing - OMI Backend

Esta guía explica cómo ejecutar todos los tests del backend.

## 📋 Prerequisitos

1. **Servidor corriendo:**
   ```bash
   npm run dev
   ```

2. **MongoDB Atlas conectado** (verificar .env)

3. **jq instalado** (para tests bash):
   ```bash
   sudo apt install jq
   ```

## 🚀 Tests Disponibles

### 1. Test Completo de la API (Recomendado)

Prueba **TODO** el sistema: Autenticación + Videos

```bash
# Versión TypeScript (recomendada)
npm test
# o
npm run test:complete

# Versión Bash
npm run test:complete:bash
```

**Qué prueba:**
- ✅ Sistema de Autenticación (7 tests)
- ✅ Gestión de Usuarios (CRUD)
- ✅ Recuperación de Contraseña Completa
- ✅ Sistema de Videos de Pexels (4 tests)
- ✅ Validaciones y Seguridad

**Total: ~12 tests en ~15 segundos**

---

### 2. Test de Flujo de Usuario

Solo prueba el sistema de usuarios (sin videos)

```bash
# Versión TypeScript
npm run test:flow

# Versión Bash
npm run test:flow:bash
```

**Qué prueba:**
1. Registro de usuario
2. Login
3. Obtener perfil
4. Actualizar perfil (nombre, apellido, edad)
5. Actualizar email
6. Cambiar contraseña
7. Solicitar recuperación
8. Restablecer contraseña + Login
9. Eliminar cuenta

**Total: 9 tests en ~10 segundos**

---

## 📊 Detalles de los Tests

### Autenticación y Usuarios

| Test | Endpoint | Método | Autenticado |
|------|----------|--------|-------------|
| Registro | `/api/auth/register` | POST | No |
| Login | `/api/auth/login` | POST | No |
| Obtener perfil | `/api/auth/profile` | GET | Sí |
| Actualizar perfil | `/api/auth/profile` | PUT | Sí |
| Cambiar contraseña | `/api/auth/profile` | PUT | Sí |
| Solicitar recuperación | `/api/auth/forgot-password` | POST | No |
| Restablecer contraseña | `/api/auth/reset-password` | POST | No |
| Eliminar cuenta | `/api/auth/account` | DELETE | Sí |

### Videos (Pexels)

| Test | Endpoint | Método | Autenticado |
|------|----------|--------|-------------|
| Buscar videos | `/api/videos/search?query=nature` | GET | No |
| Buscar con filtros | `/api/videos/search?query=ocean&orientation=landscape` | GET | No |
| Videos populares | `/api/videos/popular` | GET | No |
| Video por ID | `/api/videos/:id` | GET | No |

---

## 🔍 Interpretando Resultados

### Resultado Exitoso

```
╔════════════════════════════════════════════════════════════════════╗
║              TEST COMPLETO DE LA API - OMI BACKEND                 ║
╚════════════════════════════════════════════════════════════════════╝

✓ TODOS LOS TESTS PASARON EXITOSAMENTE! 🎉

Estadísticas:
  ✓ Tests exitosos: 12/12
  ⏱  Tiempo total: 15.23s
  🚀 Velocidad: ~0.79 tests/seg

Componentes probados:
  ✓ Sistema de Autenticación (JWT)
  ✓ Gestión de Usuarios (CRUD)
  ✓ Recuperación de Contraseña
  ✓ Sistema de Videos (Pexels)
  ✓ Validaciones y Seguridad
```

### Errores Comunes

#### ❌ Servidor no está corriendo
```
✗ Servidor no está corriendo en http://localhost:3001/api
ℹ Ejecuta: npm run dev
```

**Solución:** Ejecuta `npm run dev` en otra terminal

#### ❌ MongoDB no conectado
```
Failed to connect to MongoDB: MongoServerSelectionError
```

**Solución:** Verifica tu MONGODB_URI en `.env`

#### ❌ Pexels API Key inválida
```
Error en búsqueda de videos: 401 Unauthorized
```

**Solución:** Agrega tu PEXELS_API_KEY en `.env`

#### ⚠️ Email no enviado (Resend)
```
⚠️ Error sending email (Resend): You can only send testing emails...
```

**Esto es normal en desarrollo.** El token se muestra en los logs del servidor.

---

## 🛠️ Tests Manuales con curl

### Registro
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User",
    "age": 25
  }'
```

### Buscar Videos
```bash
curl "http://localhost:3001/api/videos/search?query=ocean&per_page=5"
```

### Videos Populares
```bash
curl "http://localhost:3001/api/videos/popular?per_page=10"
```

---

## 📝 Notas Importantes

### Modo Desarrollo
- ✅ Los tokens de recuperación se devuelven en la respuesta
- ✅ Los tokens también se muestran en los logs del servidor
- ✅ Los errores de email (Resend) no hacen fallar los tests

### Modo Producción
- ❌ Los tokens NO se devuelven en la respuesta
- ✅ Los emails se envían con Resend (requiere dominio verificado)
- ✅ Los errores de email SÍ hacen fallar la operación

### Seguridad
- 🔒 Los tests crean usuarios temporales con emails únicos
- 🗑️ Los tests limpian después (eliminan el usuario creado)
- 🔐 Cada test usa contraseñas seguras
- ⏱️ Los tokens de reset expiran en 1 hora

---

## 🚨 Troubleshooting

### Limpiar caché si hay errores de compilación
```bash
npm run clean:all
npm run dev
```

### Reiniciar MongoDB (si es local)
```bash
sudo systemctl restart mongod
```

### Ver logs del servidor en tiempo real
```bash
# Terminal 1
npm run dev

# Terminal 2
npm run test:complete:bash
```

### Verificar que Pexels API funciona
```bash
curl "http://localhost:3001/api/videos/search?query=test&per_page=1"
```

---

## 📚 Recursos

- Ver ejemplos de API: `API_EXAMPLES.md`
- Ver changelog: `CHANGELOG.md`
- Ver documentación completa: `README.md`

---

## ✨ Comandos Rápidos

```bash
# Iniciar servidor
npm run dev

# Test completo (Auth + Videos)
npm test

# Test solo usuarios
npm run test:flow:bash

# Limpiar y reiniciar
npm run clean:all && npm run dev
```

