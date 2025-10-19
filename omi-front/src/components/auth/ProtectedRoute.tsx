'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/lib/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Redirigir al home si no está autenticado
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  // Mostrar loader mientras verifica autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-gray-400">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // No renderizar nada si no está autenticado (mientras redirige)
  if (!isAuthenticated) {
    return null;
  }

  // Renderizar contenido protegido
  return <>{children}</>;
}

