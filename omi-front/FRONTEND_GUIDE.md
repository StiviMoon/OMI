# 📱 Guía del Frontend - OMI

Guía completa de los componentes de autenticación y gestión de usuarios.

## 🚀 Inicio Rápido

### 1. Configurar Variables de Entorno

El archivo `.env.local` ya está configurado:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

El frontend se abrirá en: `http://localhost:3000`

---

## 🔐 Sistema de Autenticación

### Componentes de Auth

#### 1. LoginModal

**Ubicación:** `src/components/ui/auth/LoginModal.tsx`

**Funcionalidad:**
- Iniciar sesión con email y contraseña
- Ver/ocultar contraseña
- Link a "Olvidaste tu contraseña"
- Link a "Regístrate"

**Props:**
```typescript
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister?: () => void;
  onOpenForgotPassword?: () => void;
}
```

**Uso:**
```tsx
<LoginModal
  isOpen={isLoginModalOpen}
  onClose={() => setIsLoginModalOpen(false)}
  onOpenRegister={() => setIsRegisterModalOpen(true)}
  onOpenForgotPassword={() => setIsForgotPasswordModalOpen(true)}
/>
```

**API que consume:**
- `POST /api/auth/login`

---

#### 2. RegisterModal

**Ubicación:** `src/components/ui/auth/RegisterModal.tsx`

**Funcionalidad:**
- Registro con datos completos:
  - Nombre (firstName)
  - Apellido (lastName)
  - Edad (age)
  - Email
  - Contraseña
  - Confirmar contraseña
- Validaciones del lado del cliente
- Términos y condiciones

**Props:**
```typescript
interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin?: () => void;
}
```

**Validaciones:**
- ✅ Edad entre 13 y 120 años
- ✅ Contraseña mínimo 6 caracteres
- ✅ Contraseñas deben coincidir
- ✅ Email válido
- ✅ Todos los campos requeridos

**API que consume:**
- `POST /api/auth/register`

---

#### 3. ForgotPasswordModal

**Ubicación:** `src/components/ui/auth/ForgotPasswordModal.tsx`

**Funcionalidad:**
- Solicitar recuperación de contraseña
- Mostrar confirmación de envío
- En desarrollo: mostrar token para testing

**Props:**
```typescript
interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void; // Volver al login
}
```

**Flujo:**
1. Usuario ingresa email
2. Backend genera token
3. En desarrollo: token se muestra en pantalla
4. En producción: email enviado con Resend

**API que consume:**
- `POST /api/auth/forgot-password`

---

#### 4. Reset Password Page

**Ubicación:** `src/app/reset-password/page.tsx`

**Funcionalidad:**
- Restablecer contraseña con token
- Página independiente (no modal)
- Validaciones de contraseña
- Redirección automática después de éxito

**Ruta:** `/reset-password?token=ABC123`

**Validaciones:**
- ✅ Token requerido en URL
- ✅ Contraseñas deben coincidir
- ✅ Mínimo 6 caracteres

**API que consume:**
- `POST /api/auth/reset-password`

---

### 5. ModalCuenta (Gestión de Perfil)

**Ubicación:** `src/components/ui/Cuenta/ModalCuenta.tsx`

**Funcionalidad:**

#### 📋 Sección: Información
- Ver datos del usuario:
  - Nombre
  - Apellido
  - Edad
  - Correo
- Botones: "Editar Perfil" y "Cerrar Sesión"

#### ✏️ Sección: Editar Perfil
- Modificar cualquier campo
- Validación de edad (13-120)
- Guardar cambios o cancelar

#### 🔒 Sección: Seguridad
- Cambiar contraseña
- Requiere contraseña actual
- Confirmar nueva contraseña
- Validación de mínimo 6 caracteres

#### 🗑️ Sección: Eliminar Cuenta
- Confirmación doble:
  1. Escribir "ELIMINAR"
  2. Ingresar contraseña
- Elimina datos permanentemente
- Cierra sesión automáticamente

**Props:**
```typescript
interface ModalCuentaProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**API que consume:**
- `GET /api/auth/profile` - Obtener datos
- `PUT /api/auth/profile` - Actualizar perfil
- `PUT /api/auth/profile` - Cambiar contraseña
- `DELETE /api/auth/account` - Eliminar cuenta

---

## 🔌 Servicio de API

**Ubicación:** `src/lib/api/auth.ts`

### Métodos Disponibles:

```typescript
// Registro
authApi.register(data: RegisterRequest): Promise<AuthResponse>

// Login
authApi.login(data: LoginRequest): Promise<AuthResponse>

// Obtener perfil
authApi.getProfile(): Promise<ProfileResponse>

// Actualizar perfil
authApi.updateProfile(data: UpdateProfileRequest): Promise<ProfileResponse>

// Eliminar cuenta
authApi.deleteAccount(data: DeleteAccountRequest): Promise<MessageResponse>

// Solicitar recuperación
authApi.forgotPassword(data: ForgotPasswordRequest): Promise<MessageResponse>

// Restablecer contraseña
authApi.resetPassword(data: ResetPasswordRequest): Promise<MessageResponse>

// Logout
authApi.logout(): void

// Verificar autenticación
authApi.isAuthenticated(): boolean

// Obtener token
authApi.getToken(): string | null
```

---

## 💾 LocalStorage

El sistema guarda en localStorage:

```javascript
// Token JWT
localStorage.setItem('token', token);

// Datos del usuario
localStorage.setItem('user', JSON.stringify(user));
```

Para acceder:

```typescript
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');
```

---

## 🎨 Integración en tu App

### En el Header

```tsx
import { LoginModal } from '@/components/ui/auth/LoginModal';
import { RegisterModal } from '@/components/ui/auth/RegisterModal';
import { ForgotPasswordModal } from '@/components/ui/auth/ForgotPasswordModal';

const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

return (
  <>
    <LoginModal
      isOpen={isLoginModalOpen}
      onClose={() => setIsLoginModalOpen(false)}
      onOpenRegister={() => setIsRegisterModalOpen(true)}
      onOpenForgotPassword={() => setIsForgotPasswordModalOpen(true)}
    />
    <RegisterModal
      isOpen={isRegisterModalOpen}
      onClose={() => setIsRegisterModalOpen(false)}
      onOpenLogin={() => setIsLoginModalOpen(true)}
    />
    <ForgotPasswordModal
      isOpen={isForgotPasswordModalOpen}
      onClose={() => setIsForgotPasswordModalOpen(false)}
      onBack={() => setIsLoginModalOpen(true)}
    />
  </>
);
```

### En una Página Protegida

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import type { User } from '@/lib/types/auth.types';

export default function ProtectedPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!authApi.isAuthenticated()) {
        router.push('/');
        return;
      }

      try {
        const response = await authApi.getProfile();
        setUser(response.data.user);
      } catch (error) {
        console.error('Error loading user:', error);
        authApi.logout();
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>Bienvenido, {user?.firstName}!</h1>
    </div>
  );
}
```

---

## 🎯 Tipos de TypeScript

**Ubicación:** `src/lib/types/auth.types.ts`

```typescript
// Usuario
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  createdAt: string;
  updatedAt: string;
}

// Registro
interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age: number;
}

// Login
interface LoginRequest {
  email: string;
  password: string;
}

// Actualizar perfil
interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  age?: number;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}
```

---

## ✨ Características UI/UX

### Diseño
- 🎨 Modales con backdrop blur
- 🌈 Gradientes modernos
- 📱 Totalmente responsive
- ♿ Accesibilidad WCAG 2.1

### Interacción
- ⌨️ Cierre con tecla Escape
- 🔒 Ver/ocultar contraseñas
- ✅ Validaciones en tiempo real
- 🎯 Estados de carga

### Seguridad
- 🔐 Tokens JWT
- 🔑 Contraseñas nunca expuestas
- ✔️ Validaciones en cliente y servidor
- 🛡️ Manejo seguro de errores

---

## 🧪 Testing Manual

### 1. Probar Registro

1. Abrir `http://localhost:3000`
2. Click en "Iniciar Sesión"
3. Click en "Regístrate aquí"
4. Llenar formulario con:
   - Nombre: Tu nombre
   - Apellido: Tu apellido
   - Edad: 25
   - Email: tuemail@test.com
   - Contraseña: Test123!
5. Click "CREAR CUENTA"

✅ Deberías ver la página de videos

### 2. Probar Recuperación de Contraseña

1. Click en "Iniciar Sesión"
2. Click en "¿Olvidaste tu contraseña?"
3. Ingresar email
4. En desarrollo: copiar token mostrado
5. Ir a `/reset-password?token=EL_TOKEN`
6. Ingresar nueva contraseña
7. Iniciar sesión con nueva contraseña

### 3. Probar Editar Perfil

1. Iniciar sesión
2. Click en icono de cuenta (arriba derecha)
3. Click en "Editar perfil"
4. Modificar datos
5. Click "GUARDAR CAMBIOS"

✅ Los cambios se guardan en el backend

---

## 🔗 Integración Backend-Frontend

### Backend (omi-back)
```
http://localhost:3001/api
├── /auth/register
├── /auth/login
├── /auth/profile (GET, PUT)
├── /auth/account (DELETE)
├── /auth/forgot-password
└── /auth/reset-password
```

### Frontend (omi-front)
```
Componentes → authApi → Backend API
```

**Flujo de datos:**
```
Component → authApi.method() → fetch(backend) → Response → Update UI
```

---

## 📋 Checklist de Integración

- [x] LoginModal integrado con backend
- [x] RegisterModal con campos completos
- [x] ForgotPasswordModal funcional
- [x] Página de Reset Password
- [x] ModalCuenta con CRUD completo
- [x] Servicio de API centralizado
- [x] Tipos TypeScript definidos
- [x] LocalStorage para autenticación
- [x] Manejo de errores

---

## 🎯 Próximos Pasos

1. **Iniciar ambos servidores:**
   ```bash
   # Terminal 1: Backend
   cd omi-back && npm run dev
   
   # Terminal 2: Frontend
   cd omi-front && npm run dev
   ```

2. **Probar flujo completo:**
   - Registro ✅
   - Login ✅
   - Editar perfil ✅
   - Cambiar contraseña ✅
   - Recuperar contraseña ✅
   - Eliminar cuenta ✅

3. **Verificar backend:**
   ```bash
   cd omi-back && npm test
   ```

---

¡Todo listo para usarse! 🎉

