# Ejemplos de Uso de la API - OMI Backend

Este documento contiene ejemplos prácticos de cómo usar todos los endpoints de la API.

## 🔐 Autenticación

### 1. Registrar un Nuevo Usuario

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan.perez@example.com",
    "password": "MiPassword123!",
    "firstName": "Juan",
    "lastName": "Pérez",
    "age": 28
  }'
```

**Respuesta exitosa:**
```json
{
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "6720a1b2c3d4e5f6g7h8i9j0",
      "email": "juan.perez@example.com",
      "firstName": "Juan",
      "lastName": "Pérez",
      "age": 28,
      "createdAt": "2025-10-19T10:30:00.000Z",
      "updatedAt": "2025-10-19T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzIwYTFiMmMzZDRlNWY2ZzdoOGk5ajAiLCJlbWFpbCI6Imp1YW4ucGVyZXpAZXhhbXBsZS5jb20iLCJpYXQiOjE2OTc3MTQ2MDAsImV4cCI6MTY5NzgwMTAwMH0.abc123xyz"
  }
}
```

### 2. Iniciar Sesión

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan.perez@example.com",
    "password": "MiPassword123!"
  }'
```

**Respuesta exitosa:**
```json
{
  "message": "Login successful",
  "data": {
    "user": {
      "id": "6720a1b2c3d4e5f6g7h8i9j0",
      "email": "juan.perez@example.com",
      "firstName": "Juan",
      "lastName": "Pérez",
      "age": 28,
      "createdAt": "2025-10-19T10:30:00.000Z",
      "updatedAt": "2025-10-19T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Obtener Perfil del Usuario (requiere token)

```bash
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Respuesta:**
```json
{
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "6720a1b2c3d4e5f6g7h8i9j0",
      "email": "juan.perez@example.com",
      "firstName": "Juan",
      "lastName": "Pérez",
      "age": 28,
      "createdAt": "2025-10-19T10:30:00.000Z",
      "updatedAt": "2025-10-19T10:30:00.000Z"
    }
  }
}
```

## ✏️ Actualización de Perfil

### 4. Actualizar Solo el Nombre

```bash
curl -X PUT http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Juan Carlos"
  }'
```

### 5. Actualizar Múltiples Campos

```bash
curl -X PUT http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Juan Carlos",
    "lastName": "Pérez García",
    "age": 29,
    "email": "juancarlos.perez@example.com"
  }'
```

### 6. Cambiar Contraseña

```bash
curl -X PUT http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "MiPassword123!",
    "newPassword": "NuevaPassword456!"
  }'
```

**Nota:** Para cambiar la contraseña, SIEMPRE debes proporcionar la contraseña actual.

### 7. Actualizar Email y Contraseña

```bash
curl -X PUT http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo.email@example.com",
    "currentPassword": "MiPassword123!",
    "newPassword": "NuevaPassword456!"
  }'
```

## 🔑 Recuperación de Contraseña

### 8. Solicitar Reset de Contraseña

```bash
curl -X POST http://localhost:3001/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan.perez@example.com"
  }'
```

**Respuesta (siempre es la misma por seguridad):**
```json
{
  "message": "If the email exists, a reset link has been sent"
}
```

**Nota:** El usuario recibirá un email con un enlace tipo:
```
http://localhost:3000/reset-password?token=abc123xyz...
```

### 9. Restablecer Contraseña con Token

```bash
curl -X POST http://localhost:3001/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "abc123xyz_token_from_email",
    "newPassword": "MiNuevaPassword789!"
  }'
```

**Respuesta exitosa:**
```json
{
  "message": "Password reset successfully"
}
```

**Errores comunes:**
- Token inválido o expirado (expira en 1 hora)
- Token ya utilizado

## 🗑️ Eliminar Cuenta

### 10. Eliminar Cuenta de Usuario

```bash
curl -X DELETE http://localhost:3001/api/auth/account \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "password": "MiPassword123!"
  }'
```

**Respuesta exitosa:**
```json
{
  "message": "Account deleted successfully"
}
```

**Nota:** Esta acción es IRREVERSIBLE. Todos los datos del usuario se eliminan permanentemente.

## 📹 Videos (Pexels API)

### 11. Buscar Videos

```bash
curl "http://localhost:3001/api/videos/search?query=ocean&page=1&per_page=10"
```

### 12. Videos Populares

```bash
curl "http://localhost:3001/api/videos/popular?per_page=20"
```

### 13. Obtener Video por ID

```bash
curl "http://localhost:3001/api/videos/3571264"
```

## 🧪 Flujo Completo de Prueba

### Escenario: Usuario Nuevo → Actualiza Perfil → Cambia Contraseña → Elimina Cuenta

```bash
# 1. Registrar
TOKEN=$(curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User",
    "age": 25
  }' | jq -r '.data.token')

# 2. Ver perfil
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"

# 3. Actualizar datos
curl -X PUT http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Testing",
    "age": 26
  }'

# 4. Cambiar contraseña
curl -X PUT http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "Test123!",
    "newPassword": "NewTest456!"
  }'

# 5. Eliminar cuenta
curl -X DELETE http://localhost:3001/api/auth/account \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "NewTest456!"
  }'
```

## 🛡️ Manejo de Errores

### Error: Email ya existe
```json
{
  "error": "User already exists"
}
```

### Error: Credenciales inválidas
```json
{
  "error": "Invalid credentials password not valid"
}
```

### Error: Token inválido o expirado
```json
{
  "error": "Not authenticated"
}
```

### Error: Contraseña actual incorrecta
```json
{
  "error": "Current password is incorrect"
}
```

### Error: Email ya en uso
```json
{
  "error": "Email already in use"
}
```

### Error: Edad inválida
```json
{
  "error": "Age must be between 13 and 120"
}
```

### Error: Token de reset inválido
```json
{
  "error": "Invalid or expired reset token"
}
```

## 💡 Consejos

1. **Guarda el token JWT** después del login/registro para usarlo en requests autenticados
2. **Los tokens expiran en 24h** - implementa refresh tokens si necesitas sesiones más largas
3. **Usa HTTPS en producción** para proteger contraseñas y tokens
4. **El token de reset expira en 1 hora** - asegúrate de que el usuario lo use rápido
5. **Los emails se envían con Resend** - verifica tu dominio para producción
6. **Para testing usa** `onboarding@resend.dev` como email remitente

## 🧰 Herramientas Recomendadas

- **Postman** o **Insomnia**: Para testing de API
- **curl**: Para scripts y pruebas rápidas
- **jq**: Para formatear respuestas JSON en terminal

## 🔄 Integración con Frontend

Ver archivo `README.md` para ejemplos de integración con React/Next.js

