import { Movie, SearchParams, PopularParams } from '../types';

// URL base de tu backend
// Use the environment variable or fallback to localhost
const getAPIBaseURL = () => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  return `${baseURL}/api/videos`;
};

const API_BASE_URL = getAPIBaseURL();

// Tipos de respuesta de tu backend (basados en Pexels)
interface VideoFile {
  quality: string;
  width: number;
  height: number;
  link: string;
}

interface VideoUser {
  name: string;
  url: string;
}

interface Video {
  id: number;
  width: number;
  height: number;
  duration: number;
  tags: string[];
  url: string;
  thumbnail: string;
  user: VideoUser;
  files: VideoFile[];
}

interface BackendResponse {
  success: boolean;
  data: {
    page: number;
    perPage: number;
    totalResults: number;
    hasMore: boolean;
    videos: Video[];
  };
}

interface SingleVideoResponse {
  success: boolean;
  data: {
    video: Video;
  };
}

// Función para construir query params
function buildQueryString(params: Record<string, string | number | boolean | undefined | null>): string {
  const query = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });
  
  return query.toString();
}

// Función para hacer fetch con manejo de errores mejorado
async function fetchAPI<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined | null>): Promise<T> {
  const queryString = params ? `?${buildQueryString(params)}` : '';
  const url = `${API_BASE_URL}${endpoint}${queryString}`;

  console.log('🌐 API_BASE_URL:', API_BASE_URL);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      mode: 'cors', // Explicitly set CORS mode
    });

    // Obtener el texto de la respuesta primero
    const responseText = await response.text();

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: responseText };
      }
      
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      
      throw new Error(errorData.message || errorData.error || `API Error: ${response.status}`);
    }

    // Parsear JSON
    let jsonData;
    try {
      jsonData = JSON.parse(responseText);
    } catch {
      console.error('Failed to parse JSON:', responseText);
      throw new Error('Invalid JSON response from server');
    }

    return jsonData;
  } catch (error) {
    console.error('❌ Fetch Error Details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      url,
      error
    });
    
    // If it's a network error, provide more helpful information
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        `No se puede conectar al servidor backend en ${API_BASE_URL}. ` +
        `Asegúrate de que el servidor backend esté corriendo en el puerto correcto.`
      );
    }
    
    throw error;
  }
}

// Función auxiliar para obtener el mejor archivo de video (prioriza 4K)
function getBestVideoFile(files: VideoFile[] | undefined): VideoFile | null {
  if (!files || files.length === 0) return null;

  // Prioridad 1: Buscar exactamente 3840x2160 (4K)
  const uhdFile = files.find(f => f.width === 3840 && f.height === 2160);
  if (uhdFile) return uhdFile;

  // Prioridad 2: Buscar la mayor resolución disponible
  const sortedByResolution = [...files].sort((a, b) => {
    const aPixels = a.width * a.height;
    const bPixels = b.width * b.height;
    return bPixels - aPixels; // Mayor a menor
  });

  return sortedByResolution[0] || null;
}

// Transformar datos de la API de tu backend a tu modelo interno
function transformVideo(video: Video): Movie {
  // Crear un título a partir de los tags o usar un título genérico
  const title = video.tags && video.tags.length > 0 
    ? video.tags.slice(0, 3).join(' • ')
    : `Video by ${video.user?.name || 'Unknown'}`;

  // Obtener el archivo de mejor calidad (prioriza 4K 3840x2160)
  const bestFile = getBestVideoFile(video.files);

  return {
    id: String(video.id),
    title: title.charAt(0).toUpperCase() + title.slice(1),
    posterUrl: video.thumbnail || 'https://via.placeholder.com/400x600?text=No+Image',
    duration: video.duration || 0,
    tags: video.tags || [],
    videoUrl: bestFile?.link || video.url || '',
    user: video.user || { name: 'Unknown', url: '' },
    width: bestFile?.width || video.width || 1920,
    height: bestFile?.height || video.height || 1080,
  };
}

// Servicios de API
export const videosAPI = {
  /**
   * Buscar videos
   * GET /api/videos/search
   */
  async search(params: SearchParams): Promise<Movie[]> {
    try {
      const data = await fetchAPI<BackendResponse>('/search', params as unknown as Record<string, string | number | boolean | undefined | null>);
      
      
      if (!data || !data.success || !data.data?.videos) {
        console.warn('⚠️ No videos in response');
        return [];
      }
      
      return data.data.videos.map(transformVideo);
    } catch (error) {
      console.error('Error searching videos:', error);
      return [];
    }
  },

  /**
   * Obtener videos populares
   * GET /api/videos/popular
   */
  async getPopular(params?: PopularParams): Promise<Movie[]> {
    try {
      const data = await fetchAPI<BackendResponse>('/popular', params as unknown as Record<string, string | number | boolean | undefined | null> | undefined);
      
      
      if (!data || !data.success || !data.data?.videos) {
        console.warn('⚠️ No videos in response');
        return [];
      }
      
      return data.data.videos.map(transformVideo);
    } catch (error) {
      console.error('Error fetching popular videos:', error);
      return [];
    }
  },

  /**
   * Obtener video por ID
   * GET /api/videos/:id
   */
  async getById(id: string): Promise<Movie | null> {
    try {
      const data = await fetchAPI<SingleVideoResponse>(`/${id}`);
      
      if (!data || !data.success || !data.data?.video) {
        console.warn('⚠️ No video in response');
        return null;
      }
      
      return transformVideo(data.data.video);
    } catch (error) {
      console.error(`Error fetching video ${id}:`, error);
      return null;
    }
  },

  /**
   * Obtener videos por categoría (usando search)
   */
  async getByCategory(category: string, perPage: number = 15): Promise<Movie[]> {
    return this.search({ query: category, per_page: perPage });
  },

  /**
   * Obtener video destacado para el hero banner
   * Renderiza el video número 5 de los videos populares
   */
  async getFeatured(): Promise<{
    title: string;
    description: string;
    backdropUrl: string;
    videoUrl?: string;
  } | null> {
    try {
      // Buscar suficientes videos para asegurar que tenemos al menos 5
      const data = await fetchAPI<BackendResponse>('/popular', { per_page: 10 });
      
      if (!data || !data.success || !data.data?.videos || data.data.videos.length === 0) {
        console.warn('⚠️ No featured video available');
        return null;
      }

      // Seleccionar el quinto video (índice 4)
      const videoIndex = 4;
      const video = data.data.videos[videoIndex];

      if (!video) {
        console.warn(`⚠️ Video at index ${videoIndex} not available`);
        // Fallback al último video disponible
        const fallbackVideo = data.data.videos[data.data.videos.length - 1];
        if (!fallbackVideo) {
          return null;
        }
        
        const bestFile = getBestVideoFile(fallbackVideo.files);
        return {
          title: fallbackVideo.tags && fallbackVideo.tags[0] 
            ? fallbackVideo.tags[0].charAt(0).toUpperCase() + fallbackVideo.tags[0].slice(1)
            : 'Video Destacado',
          description: fallbackVideo.tags && fallbackVideo.tags.length > 0
            ? `Un increíble video de ${fallbackVideo.tags.slice(0, 3).join(', ')} por ${fallbackVideo.user?.name || 'Unknown'}. Duración: ${Math.floor(fallbackVideo.duration || 0)}s`
            : `Video por ${fallbackVideo.user?.name || 'Unknown'}`,
          backdropUrl: fallbackVideo.thumbnail,
          videoUrl: bestFile?.link || fallbackVideo.url || '',
        };
      }

      // Obtener el mejor archivo del video (prioriza 4K 3840x2160)
      const bestFile = getBestVideoFile(video.files);

      return {
        title: video.tags && video.tags[0] 
          ? video.tags[0].charAt(0).toUpperCase() + video.tags[0].slice(1)
          : 'Video Destacado',
        description: video.tags && video.tags.length > 0
          ? `Un increíble video de ${video.tags.slice(0, 3).join(', ')} por ${video.user?.name || 'Unknown'}. Duración: ${Math.floor(video.duration || 0)}s`
          : `Video por ${video.user?.name || 'Unknown'}`,
        backdropUrl: video.thumbnail,
        videoUrl: bestFile?.link || video.url || '',
      };
    } catch (error) {
      console.error('Error fetching featured video:', error);
      return null;
    }
  },
};