'use client';

import { useState, useEffect } from 'react';
import { Movie, SearchParams, PopularParams } from '../types';
import { videosAPI } from '../api/videos';

/**
 * Options for the {@link useVideos} hook.
 *
 * @interface UseVideosOptions
 */
interface UseVideosOptions {
  /** Type of video request to perform. */
  type: 'popular' | 'search' | 'category';
  /** Parameters for search queries. */
  searchParams?: Partial<SearchParams>;
  /** Parameters for popular video queries. */
  popularParams?: PopularParams;
  /** Optional search or category query string. */
  query?: string;
}

/* =====================================================
   🎬 useVideos — Hook to fetch multiple video lists
===================================================== */

/**
 * React hook to fetch a list of videos from the backend.
 * Supports popular, search, and category-based queries.
 *
 * Handles loading, error, and state management automatically.
 *
 * @example
 * ```tsx
 * const { movies, loading, error } = useVideos({
 *   type: 'search',
 *   query: 'nature',
 *   searchParams: { per_page: 10 }
 * });
 * ```
 *
 * @param {UseVideosOptions} options - Configuration for the video request.
 * @returns {{ movies: Movie[], loading: boolean, error: string | null }}
 */
export function useVideos({ type, searchParams, popularParams, query }: UseVideosOptions) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true);
        setError(null);

        let data: Movie[] = [];

        switch (type) {
          case 'popular':
            data = await videosAPI.getPopular(popularParams);
            break;
          case 'search':
            if (query) {
              data = await videosAPI.search({ query, ...searchParams });
            }
            break;
          case 'category':
            if (query) {
              data = await videosAPI.getByCategory(query, searchParams?.per_page || 15);
            }
            break;
        }

        setMovies(data);
      } catch (err) {
        console.error('❌ Error fetching videos:', err);
        setError('Error al cargar videos');
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
    // Only re-run when type or query changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, query]);

  return { movies, loading, error };
}

/* =====================================================
   🌟 useFeaturedVideo — Hook to fetch hero banner video
===================================================== */

/**
 * React hook to fetch the "featured" video displayed in the HeroBanner.
 *
 * Automatically handles loading and error states.
 *
 * @example
 * ```tsx
 * const { featured, loading, error } = useFeaturedVideo();
 * ```
 *
 * @returns {{
 *   featured: { title: string; description: string; backdropUrl: string; videoUrl?: string } | null,
 *   loading: boolean,
 *   error: string | null
 * }}
 */
export function useFeaturedVideo() {
  const [featured, setFeatured] = useState<{
    title: string;
    description: string;
    backdropUrl: string;
    videoUrl?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        setLoading(true);
        const data = await videosAPI.getFeatured();
        setFeatured(data);
      } catch (err) {
        console.error('❌ Error fetching featured video:', err);
        setError('Error al cargar video destacado');
      } finally {
        setLoading(false);
      }
    }

    fetchFeatured();
  }, []);

  return { featured, loading, error };
}

/* =====================================================
   🎥 useVideoById — Hook to fetch a single video
===================================================== */

/**
 * React hook to fetch an individual video by its ID.
 *
 * @example
 * ```tsx
 * const { video, loading, error } = useVideoById('123456');
 * ```
 *
 * @param {string | null} id - Video identifier (string). If null, the hook does nothing.
 * @returns {{ video: Movie | null, loading: boolean, error: string | null }}
 */
export function useVideoById(id: string | null) {
  const [video, setVideo] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function fetchVideo() {
      try {
        setLoading(true);
        const data = await videosAPI.getById(id);
        setVideo(data);
      } catch (err) {
        console.error('❌ Error fetching video by ID:', err);
        setError('Error al cargar video');
      } finally {
        setLoading(false);
      }
    }

    fetchVideo();
  }, [id]);

  return { video, loading, error };
}
