# Changelog - OMI Backend

## [2.0.0] - 2025-10-19

### ✨ Nuevas Funcionalidades

#### Sistema de Autenticación Completo
- ✅ **Registro extendido**: Ahora incluye nombre, apellido, edad, email y contraseña
- ✅ **Actualización de perfil**: Permite editar todos los campos del usuario
- ✅ **Cambio de contraseña**: Con verificación de contraseña actual
- ✅ **Cambio de email**: Con validación de unicidad
- ✅ **Recuperación de contraseña**: Sistema completo con tokens temporales
- ✅ **Restablecer contraseña**: Usando tokens seguros con expiración de 1 hora
- ✅ **Eliminación de cuenta**: Con verificación de contraseña

#### Servicio de Email
- ✅ **Integración con Resend**: Servicio moderno de email
- ✅ **Emails HTML**: Templates profesionales y responsivos
- ✅ **Modo desarrollo**: Tokens mostrados en logs para testing
- ✅ **Modo producción**: Envío real de emails (requiere dominio verificado)

### 🏗️ Arquitectura

#### Nuevos Casos de Uso
- `update-profile.use-case.ts` - Actualización de datos de usuario
- `delete-account.use-case.ts` - Eliminación de cuenta con validación
- `forgot-password.use-case.ts` - Generación de token de recuperación
- `reset-password.use-case.ts` - Restablecimiento de contraseña

#### Entidad User Extendida
- Nuevos campos: `firstName`, `lastName`, `age`
- Nuevos campos internos: `resetPasswordToken`, `resetPasswordExpires`
- Métodos: `update()`, `setResetPasswordToken()`, `clearResetPasswordToken()`

#### Repositorio Actualizado
- Método `update()` - Actualización de usuarios
- Método `delete()` - Eliminación de usuarios
- Método `findByResetToken()` - Búsqueda por token de reset

### 🧪 Testing

#### Scripts de Test
- `test-user-flow.ts` - Suite completa de tests en TypeScript
- `test-user-flow.sh` - Suite completa de tests en Bash
- `clean-and-restart.sh` - Script de limpieza y reinicio

#### Cobertura de Tests
1. ✅ Registro de usuario
2. ✅ Login
3. ✅ Obtener perfil
4. ✅ Actualizar perfil (nombre, apellido, edad)
5. ✅ Actualizar email
6. ✅ Cambiar contraseña
7. ✅ Solicitar recuperación de contraseña
8. ✅ Restablecer contraseña con token
9. ✅ Eliminar cuenta

### 📝 Documentación

- `README.md` - Documentación completa actualizada
- `API_EXAMPLES.md` - Ejemplos prácticos de uso
- `CHANGELOG.md` - Historial de cambios
- `.env.example` - Template de configuración

### 🔧 Mejoras Técnicas

- ✅ Validación de edad (13-120 años)
- ✅ Sanitización de datos (trim, lowercase en emails)
- ✅ Tokens criptográficamente seguros (crypto.randomBytes)
- ✅ Hash de tokens de reset (SHA-256)
- ✅ Expiración automática de tokens (1 hora)
- ✅ Manejo de errores mejorado
- ✅ Type-safety completo con TypeScript

### 📦 Dependencias

#### Agregadas
- `resend` - Servicio de email moderno

#### Removidas
- `nodemailer` - Reemplazado por Resend

### 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt (12 rounds)
- ✅ Tokens JWT con expiración
- ✅ Tokens de reset con expiración temporal
- ✅ Validación de contraseña actual para cambios
- ✅ No revelar si un email existe en forgot-password
- ✅ Sanitización de inputs

### 📊 API Endpoints

#### Nuevos Endpoints
```
PUT    /api/auth/profile         - Actualizar perfil
DELETE /api/auth/account         - Eliminar cuenta
POST   /api/auth/forgot-password - Solicitar recuperación
POST   /api/auth/reset-password  - Restablecer contraseña
```

#### Endpoints Actualizados
```
POST /api/auth/register - Ahora requiere firstName, lastName, age
GET  /api/auth/profile  - Ahora devuelve firstName, lastName, age
```

---

## [1.0.0] - 2025-10-18

### Versión Inicial
- Registro básico (email, password)
- Login con JWT
- Integración con Pexels API
- Clean Architecture

