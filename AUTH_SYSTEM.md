# 🔐 Sistema de Autenticación y Protección de Rutas

## 📋 Descripción

Sistema completo de autenticación implementado en el frontend con protección de rutas, gestión global de estado de usuario y limpieza automática de sesión.

---

## 🏗️ Arquitectura

### **1. AuthContext (Global State)**
📁 `omi-front/src/lib/context/AuthContext.tsx`

Contexto global que maneja el estado de autenticación en toda la aplicación.

**Funciones:**
```typescript
- user: User | null              // Usuario actual
- loading: boolean               // Estado de carga
- isAuthenticated: boolean       // Si está autenticado
- login(userData, token)         // Iniciar sesión
- logout()                       // Cerrar sesión (limpia todo)
- updateUser(userData)           // Actualizar datos del usuario
- checkAuth()                    // Verificar autenticación
```

**Uso:**
```typescript
import { useAuthContext } from '@/lib/context/AuthContext';

const { user, isAuthenticated, logout } = useAuthContext();
```

---

### **2. ProtectedRoute Component**
📁 `omi-front/src/components/auth/ProtectedRoute.tsx`

Componente de guardia que protege rutas privadas.

**Características:**
- ✅ Verifica autenticación antes de renderizar
- ✅ Muestra loader durante verificación
- ✅ Redirige al home si no está autenticado
- ✅ Previene acceso a rutas protegidas sin login

**Uso:**
```typescript
// En el layout de rutas protegidas
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function VideosLayout({ children }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}
```

---

### **3. useAuth Hook (Utilities)**
📁 `omi-front/src/lib/hooks/useAuth.ts`

Hook personalizado con utilidades de autenticación (alternativa al contexto).

---

## 🔄 Flujo de Autenticación

### **Login / Registro:**

1. **Usuario ingresa credenciales** → LoginModal / RegisterModal
2. **Petición al backend** → `authApi.login()` / `authApi.register()`
3. **Respuesta exitosa** → `login(userData, token)` del contexto
4. **Guardado automático:**
   ```typescript
   localStorage.setItem('token', token)
   localStorage.setItem('user', JSON.stringify(userData))
   ```
5. **Estado global actualizado** → `isAuthenticated = true`
6. **Redirección** → `/videos`

---

### **Logout:**

1. **Usuario cierra sesión** → `logout()` del contexto
2. **Limpieza completa:**
   ```typescript
   localStorage.removeItem('token')
   localStorage.removeItem('user')
   setUser(null)
   setIsAuthenticated(false)
   ```
3. **Redirección automática** → `/` (home)

---

### **Verificación de Rutas:**

1. **Usuario intenta acceder a /videos**
2. **ProtectedRoute se activa** → verifica `isAuthenticated`
3. **Si NO está autenticado:**
   - Muestra loader (breve)
   - Redirige a `/`
4. **Si SÍ está autenticado:**
   - Renderiza el contenido protegido

---

## 🛡️ Rutas Protegidas

### **Actualmente protegidas:**
- ✅ `/videos` - Catálogo de videos (requiere login)

### **Rutas públicas:**
- ✅ `/` - Home (landing page)
- ✅ `/about` - Acerca de
- ✅ `/reset-password` - Recuperar contraseña

---

## 📝 Implementación en Nuevas Rutas

### **Proteger una nueva ruta:**

**Opción 1 - Layout específico:**
```typescript
// src/app/mi-ruta-privada/layout.tsx
'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function MiRutaLayout({ children }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}
```

**Opción 2 - En la página directamente:**
```typescript
// src/app/mi-ruta-privada/page.tsx
'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function MiRutaPage() {
  return (
    <ProtectedRoute>
      <div>Contenido privado</div>
    </ProtectedRoute>
  );
}
```

---

## 🔧 Uso en Componentes

### **Obtener datos del usuario:**
```typescript
'use client';

import { useAuthContext } from '@/lib/context/AuthContext';

export function MiComponente() {
  const { user, isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <div>Debes iniciar sesión</div>;
  }

  return (
    <div>
      <h1>Hola, {user?.firstName}!</h1>
      <p>Email: {user?.email}</p>
    </div>
  );
}
```

### **Cerrar sesión:**
```typescript
'use client';

import { useAuthContext } from '@/lib/context/AuthContext';

export function LogoutButton() {
  const { logout } = useAuthContext();

  return (
    <button onClick={logout}>
      Cerrar Sesión
    </button>
  );
}
```

### **Actualizar perfil:**
```typescript
'use client';

import { useAuthContext } from '@/lib/context/AuthContext';
import { authApi } from '@/lib/api/auth';

export function EditarPerfil() {
  const { updateUser } = useAuthContext();

  const handleSave = async (newData) => {
    const response = await authApi.updateProfile(newData);
    updateUser(response.data.user); // Actualiza el contexto global
  };

  return <form onSubmit={handleSave}>...</form>;
}
```

---

## ⚡ Características Clave

### **✅ Seguridad:**
- Token JWT guardado en localStorage
- Verificación automática en cada ruta protegida
- Limpieza completa al cerrar sesión
- Redireccionamiento automático

### **✅ UX:**
- Loading state durante verificación
- Redirecciones automáticas
- Estado global sincronizado
- Persistencia entre recargas de página

### **✅ Mantenibilidad:**
- Lógica centralizada en AuthContext
- Componente reutilizable (ProtectedRoute)
- Fácil de extender a nuevas rutas
- Separación de responsabilidades

---

## 🚀 Ventajas del Sistema

1. **Centralización:** Toda la lógica de auth en un solo lugar
2. **Reusabilidad:** ProtectedRoute se usa en cualquier ruta
3. **Automatización:** Logout limpia todo automáticamente
4. **Persistencia:** El estado se mantiene entre recargas
5. **Escalabilidad:** Fácil agregar nuevas rutas protegidas

---

## 📦 Archivos del Sistema

```
omi-front/src/
├── lib/
│   ├── context/
│   │   └── AuthContext.tsx         ← Estado global de auth
│   └── hooks/
│       └── useAuth.ts              ← Hook de utilidades
├── components/
│   └── auth/
│       └── ProtectedRoute.tsx      ← Guardia de rutas
├── app/
│   ├── layout.tsx                  ← AuthProvider envuelve la app
│   └── videos/
│       └── layout.tsx              ← Usa ProtectedRoute
└── components/ui/
    ├── auth/
    │   ├── LoginModal.tsx          ← Usa login() del contexto
    │   └── RegisterModal.tsx       ← Usa login() del contexto
    └── Cuenta/
        └── ModalCuenta.tsx         ← Usa logout() del contexto
```

---

## 🎯 TODO: Mejoras Futuras

- [ ] Refresh token automático
- [ ] Interceptor de axios para agregar token a requests
- [ ] Redirección inteligente (volver a la página anterior)
- [ ] Remember me (persistir sesión por más tiempo)
- [ ] Protección por roles (admin, user, etc.)
- [ ] Session timeout automático

---

✅ **Sistema completamente implementado y funcional**

El frontend ahora tiene un sistema robusto de autenticación con protección de rutas, gestión global de estado y limpieza automática de sesión.

