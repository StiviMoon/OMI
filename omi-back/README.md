# OMI API

API Backend profesional con autenticación JWT y servicios de video de Pexels.

## 🚀 Tecnologías

- **Node.js** + **Express** + **TypeScript**
- **MongoDB** (Database)
- **JWT** (Autenticación)
- **Axios** (Peticiones HTTP)
- **Clean Architecture**

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env y agrega tus credenciales
```

### Variables de Entorno

```bash
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/OMI-S
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:3000
PEXELS_API_KEY=your-pexels-api-key
```

**Obtener API Key de Pexels:** https://www.pexels.com/api/

## 🏃 Ejecución

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## 📡 Endpoints

### Autenticación

```bash
# Registrar usuario
POST /api/auth/register
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "password123"
}

# Login
POST /api/auth/login
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "password123"
}

# Perfil (requiere token)
GET /api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

### Videos de Pexels

#### Buscar Videos

```bash
GET /api/videos/search?query=ocean&page=1&per_page=20
```

**Parámetros:**
- `query` (requerido): Término de búsqueda
- `page`: Página (default: 1)
- `per_page`: Resultados por página (1-80, default: 15)
- `orientation`: `landscape` | `portrait` | `square`
- `size`: `large` | `medium` | `small`
- `min_duration`: Duración mínima en segundos
- `max_duration`: Duración máxima en segundos

**Ejemplos:**
```bash
# Búsqueda básica
curl "http://localhost:3000/api/videos/search?query=nature"

# Con filtros
curl "http://localhost:3000/api/videos/search?query=ocean&orientation=landscape&min_duration=10&max_duration=30"
```

#### Videos Populares

```bash
GET /api/videos/popular?per_page=20
```

**Parámetros:**
- `page`: Página (default: 1)
- `per_page`: Resultados por página (1-80, default: 15)
- `min_width`: Ancho mínimo en píxeles
- `min_height`: Alto mínimo en píxeles
- `min_duration`: Duración mínima en segundos
- `max_duration`: Duración máxima en segundos

**Ejemplo:**
```bash
# Videos Full HD
curl "http://localhost:3000/api/videos/popular?min_width=1920&min_height=1080"
```

#### Video por ID

```bash
GET /api/videos/:id
```

**Ejemplo:**
```bash
curl "http://localhost:3000/api/videos/123456"
```

## 📦 Formato de Respuesta

### Respuesta Exitosa

```json
{
  "success": true,
  "data": {
    "page": 1,
    "perPage": 15,
    "totalResults": 5000,
    "hasMore": true,
    "videos": [
      {
        "id": 123456,
        "width": 1920,
        "height": 1080,
        "duration": 30,
        "tags": ["nature", "ocean"],
        "url": "https://www.pexels.com/video/...",
        "thumbnail": "https://images.pexels.com/...",
        "user": {
          "name": "John Doe",
          "url": "https://www.pexels.com/@johndoe"
        },
        "files": [
          {
            "quality": "hd",
            "width": 1920,
            "height": 1080,
            "link": "https://player.vimeo.com/..."
          }
        ]
      }
    ]
  }
}
```

### Respuesta de Error

```json
{
  "success": false,
  "message": "Query parameter is required"
}
```

## 🔌 Integración con Frontend

### Servicio TypeScript

```typescript
// services/videoApi.ts
const API_BASE_URL = 'http://localhost:3000/api/videos';

export interface Video {
  id: number;
  width: number;
  height: number;
  duration: number;
  tags: string[];
  url: string;
  thumbnail: string;
  user: { name: string; url: string };
  files: { quality: string; width: number; height: number; link: string }[];
}

export const videoApi = {
  async searchVideos(query: string, page = 1, perPage = 15) {
    const response = await fetch(
      `${API_BASE_URL}/search?query=${query}&page=${page}&per_page=${perPage}`
    );
    return response.json();
  },

  async getPopularVideos(page = 1, perPage = 15) {
    const response = await fetch(
      `${API_BASE_URL}/popular?page=${page}&per_page=${perPage}`
    );
    return response.json();
  },

  async getVideoById(id: number) {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    return response.json();
  },
};
```

### Hook de React

```typescript
// hooks/useVideos.ts
import { useState, useEffect } from 'react';
import { videoApi } from '@/services/videoApi';

export const useSearchVideos = (query: string) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!query) return;
      
      setLoading(true);
      try {
        const result = await videoApi.searchVideos(query);
        if (result.success) {
          setVideos(result.data.videos);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [query]);

  return { videos, loading, error };
};
```

### Uso en Componente

```typescript
// pages/videos.tsx
import { useSearchVideos } from '@/hooks/useVideos';

export default function VideosPage() {
  const { videos, loading, error } = useSearchVideos('nature');

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {videos.map((video) => (
        <div key={video.id}>
          <video src={video.files[0]?.link} poster={video.thumbnail} controls />
          <p>{video.user.name}</p>
        </div>
      ))}
    </div>
  );
}
```

## 🏗️ Arquitectura

```
src/
├── config/              # Configuración
├── domain/              # Entidades y casos de uso
├── infrastructure/      # Servicios externos (DB, APIs)
│   └── services/
│       └── pexels.service.ts
├── presentation/        # Controllers, Routes, Middleware
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── pexels.controller.ts
│   └── routes/
│       ├── auth.routes.ts
│       └── pexels.routes.ts
└── types/              # TypeScript types
```

## ✨ Características

- ✅ Clean Architecture
- ✅ Type-safe con TypeScript
- ✅ Autenticación JWT
- ✅ Integración Pexels Videos API
- ✅ Filtros avanzados de búsqueda
- ✅ Respuestas optimizadas
- ✅ Validación de parámetros
- ✅ Manejo de errores

## 📝 Notas

- **Rate Limit Pexels:** 200 requests/hora (plan gratuito)
- **Calidades disponibles:** 4K, HD, SD (se filtran automáticamente las SD)
- **Paginación:** Máximo 80 resultados por página

## 🔗 Recursos

- [Pexels API Docs](https://www.pexels.com/api/documentation/)
- [Express Docs](https://expressjs.com/)
- [TypeScript Docs](https://www.typescriptlang.org/)
