import React from 'react';

// Skeleton para Hero Banner
export const HeroBannerSkeleton: React.FC = () => (
  <div className="
    relative overflow-hidden w-full
    h-[300px] sm:h-[400px] lg:h-[500px]
    mt-16 md:mt-0
    bg-gray-900
    animate-pulse
  ">
    <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-transparent" />
    <div className="
      relative z-10 flex h-full items-center
      px-4 sm:px-8 lg:px-16
    ">
      <div className="w-full sm:max-w-xl lg:max-w-2xl space-y-4">
        <div className="w-16 h-6 bg-gray-700 rounded" />
        <div className="w-3/4 h-12 sm:h-16 lg:h-20 bg-gray-700 rounded" />
        <div className="w-full h-4 bg-gray-700 rounded" />
        <div className="w-5/6 h-4 bg-gray-700 rounded" />
        <div className="w-32 h-10 bg-gray-700 rounded mt-6" />
      </div>
    </div>
  </div>
);

// Skeleton para MovieCard
export const MovieCardSkeleton: React.FC = () => (
  <div className="
    relative flex-shrink-0 overflow-hidden rounded-lg
    w-[140px] sm:w-[170px] lg:w-[200px]
    aspect-[2/3]
    bg-gray-800
    animate-pulse
  " />
);

// Skeleton para ContentSection
export const ContentSectionSkeleton: React.FC = () => (
  <div className="py-6 sm:py-8">
    <div className="flex items-center justify-between mb-4 sm:mb-6 px-4 sm:px-8 lg:px-16">
      <div className="w-32 sm:w-48 h-6 sm:h-8 bg-gray-800 rounded animate-pulse" />
    </div>
    <div className="px-4 sm:px-8 lg:px-16">
      <div className="flex gap-2 sm:gap-3 lg:gap-4 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

// Skeleton para lista completa de secciones
interface ContentSkeletonProps {
  count?: number;
}

export const ContentListSkeleton: React.FC<ContentSkeletonProps> = ({ count = 4 }) => (
  <>
    {[...Array(count)].map((_, i) => (
      <ContentSectionSkeleton key={i} />
    ))}
  </>
);

// Spinner de carga general
export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`
        ${sizeClasses[size]}
        border-4 border-gray-700 border-t-pink-500
        rounded-full
        animate-spin
      `} />
    </div>
  );
};

// Estado de error
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Error al cargar',
  message = 'No se pudieron cargar los datos. Por favor, intenta nuevamente.',
  onRetry
}) => (
  <div className="flex items-center justify-center py-16 px-4">
    <div className="text-center max-w-md">
      <div className="mb-4">
        <svg 
          className="w-16 h-16 mx-auto text-gray-600"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-gray-400 mb-6">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors text-sm sm:text-base"
        >
          Intentar nuevamente
        </button>
      )}
    </div>
  </div>
);

// Estado vacío
interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No hay contenido',
  message = 'No se encontraron resultados.',
  icon
}) => (
  <div className="flex items-center justify-center py-16 px-4">
    <div className="text-center max-w-md">
      {icon && (
        <div className="mb-4 text-gray-600">
          {icon}
        </div>
      )}
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-gray-400">
        {message}
      </p>
    </div>
  </div>
);