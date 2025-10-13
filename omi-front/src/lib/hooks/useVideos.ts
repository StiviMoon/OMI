'use client';

import { useState, useEffect } from 'react';
import { Movie, SearchParams, PopularParams } from '../types';
import { videosAPI } from '../api/videos';

interface UseVideosOptions {
  type: 'popular' | 'search' | 'category';
  searchParams?: Partial<SearchParams>;
  popularParams?: PopularParams;
  query?: string;
}

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
              data = await videosAPI.search({ 
                query, 
                ...searchParams 
              });
            }
            break;
          case 'category':
            if (query) {
              data = await videosAPI.getByCategory(
                query, 
                searchParams?.per_page || 15
              );
            }
            break;
        }

        setMovies(data);
      } catch (err) {
        setError('Error al cargar videos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, query]);

  return { movies, loading, error };
}

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
        setError('Error al cargar video destacado');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeatured();
  }, []);

  return { featured, loading, error };
}

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
        // Type assertion safe because we checked !id above
        const data = await videosAPI.getById(id as string);
        setVideo(data);
      } catch (err) {
        setError('Error al cargar video');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchVideo();
  }, [id]);

  return { video, loading, error };
}