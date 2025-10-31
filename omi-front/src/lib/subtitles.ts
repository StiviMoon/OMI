// Subtítulos simulados para videos
// Genera subtítulos basados en el tiempo del video y los tags/metadata

export type SubtitleLanguage = 'es' | 'en';

export interface SubtitleSegment {
  start: number; // tiempo en segundos
  end: number;
  text: {
    es: string;
    en: string;
  };
}

// Generar subtítulos simulados basados en tags y duración del video
export const generateSubtitles = (
  tags: string[] = [],
  duration: number,
  title?: string
): SubtitleSegment[] => {
  const segments: SubtitleSegment[] = [];
  
  if (duration <= 0) return segments;
  
  if (!tags || tags.length === 0) {
    // Subtítulos genéricos si no hay tags
    return generateGenericSubtitles(duration, title);
  }

  // Añadir subtítulo de bienvenida al inicio (primeros 4 segundos)
  const welcomeDuration = Math.min(4, duration * 0.1);
  segments.push({
    start: 0,
    end: welcomeDuration,
    text: {
      es: title ? `Bienvenido a: ${title}` : 'Bienvenido a este video',
      en: title ? `Welcome to: ${title}` : 'Welcome to this video',
    },
  });

  // Dividir el resto del video en segmentos basados en tags
  const remainingDuration = duration - welcomeDuration;
  const segmentDuration = remainingDuration / Math.max(tags.length, 1);
  const segmentCount = Math.min(tags.length, Math.floor(remainingDuration / 5)); // Mínimo 5 segundos por segmento
  
  for (let i = 0; i < segmentCount && i < tags.length; i++) {
    const start = welcomeDuration + (i * segmentDuration);
    const end = Math.min(welcomeDuration + ((i + 1) * segmentDuration), duration - 2); // Dejar espacio para el final
    
    if (end - start < 3) continue; // Saltar segmentos muy cortos
    
    // Traducir el tag a español e inglés
    const tagTranslations = translateTag(tags[i]);
    
    segments.push({
      start: Math.floor(start),
      end: Math.floor(end),
      text: {
        es: `Escena de ${tagTranslations.es}. ${getDescription(tagTranslations.es, 'es')}`,
        en: `${tagTranslations.en} scene. ${getDescription(tagTranslations.en, 'en')}`,
      },
    });
  }

  // Añadir subtítulo final (últimos 2-3 segundos)
  if (duration > 5) {
    segments.push({
      start: Math.max(welcomeDuration + (segmentCount * segmentDuration), duration - 3),
      end: duration,
      text: {
        es: 'Gracias por ver',
        en: 'Thanks for watching',
      },
    });
  }

  // Ordenar por tiempo de inicio
  return segments.sort((a, b) => a.start - b.start);
};

// Generar subtítulos genéricos
const generateGenericSubtitles = (duration: number, title?: string): SubtitleSegment[] => {
  const segments: SubtitleSegment[] = [];
  const segmentCount = Math.max(3, Math.floor(duration / 10));
  const segmentDuration = duration / segmentCount;

  // Subtítulo de bienvenida
  segments.push({
    start: 0,
    end: Math.min(3, duration),
    text: {
      es: title ? `Bienvenido a: ${title}` : 'Bienvenido a este video',
      en: title ? `Welcome to: ${title}` : 'Welcome to this video',
    },
  });

  // Subtítulos intermedios
  for (let i = 1; i < segmentCount - 1; i++) {
    const start = i * segmentDuration;
    const end = (i + 1) * segmentDuration;
    
    segments.push({
      start: Math.floor(start),
      end: Math.floor(end),
      text: {
        es: `Continuando con el video... Escena ${i}`,
        en: `Continuing with the video... Scene ${i}`,
      },
    });
  }

  // Subtítulo final
  segments.push({
    start: Math.max(0, duration - 2),
    end: duration,
    text: {
      es: 'Gracias por ver',
      en: 'Thanks for watching',
    },
  });

  return segments;
};

// Traducir tags comunes
const translateTag = (tag: string): { es: string; en: string } => {
  const translations: Record<string, { es: string; en: string }> = {
    nature: { es: 'naturaleza', en: 'nature' },
    landscape: { es: 'paisaje', en: 'landscape' },
    water: { es: 'agua', en: 'water' },
    ocean: { es: 'océano', en: 'ocean' },
    beach: { es: 'playa', en: 'beach' },
    forest: { es: 'bosque', en: 'forest' },
    mountain: { es: 'montaña', en: 'mountain' },
    city: { es: 'ciudad', en: 'city' },
    urban: { es: 'urbano', en: 'urban' },
    technology: { es: 'tecnología', en: 'technology' },
    sunset: { es: 'atardecer', en: 'sunset' },
    sunrise: { es: 'amanecer', en: 'sunrise' },
    sky: { es: 'cielo', en: 'sky' },
    clouds: { es: 'nubes', en: 'clouds' },
    travel: { es: 'viaje', en: 'travel' },
    adventure: { es: 'aventura', en: 'adventure' },
    people: { es: 'personas', en: 'people' },
    business: { es: 'negocios', en: 'business' },
    abstract: { es: 'abstracto', en: 'abstract' },
  };

  const normalizedTag = tag.toLowerCase().trim();
  
  if (translations[normalizedTag]) {
    return translations[normalizedTag];
  }

  // Si no hay traducción, usar el tag original
  return { es: tag, en: tag };
};

// Obtener descripciones contextuales
const getDescription = (tag: string, lang: 'es' | 'en'): string => {
  const descriptions: Record<string, { es: string; en: string }> = {
    naturaleza: { es: 'Disfruta de la belleza natural', en: 'Enjoy the natural beauty' },
    nature: { es: 'Disfruta de la belleza natural', en: 'Enjoy the natural beauty' },
    paisaje: { es: 'Impresionantes vistas panorámicas', en: 'Stunning panoramic views' },
    landscape: { es: 'Impresionantes vistas panorámicas', en: 'Stunning panoramic views' },
    ciudad: { es: 'Vida urbana dinámica', en: 'Dynamic urban life' },
    city: { es: 'Vida urbana dinámica', en: 'Dynamic urban life' },
    tecnología: { es: 'Innovación y futuro', en: 'Innovation and future' },
    technology: { es: 'Innovación y futuro', en: 'Innovation and future' },
  };

  const normalizedTag = tag.toLowerCase().trim();
  
  if (descriptions[normalizedTag]) {
    return descriptions[normalizedTag][lang];
  }

  return lang === 'es' ? 'Disfruta de esta escena' : 'Enjoy this scene';
};

// Obtener el subtítulo actual basado en el tiempo
export const getCurrentSubtitle = (
  segments: SubtitleSegment[],
  currentTime: number,
  language: SubtitleLanguage
): string | null => {
  const segment = segments.find(
    (s) => currentTime >= s.start && currentTime <= s.end
  );
  
  return segment ? segment.text[language] : null;
};

