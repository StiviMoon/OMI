'use client';

import React from 'react';
import { Tv, Download, Zap } from 'lucide-react';

interface Feature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    id: 'multi-device',
    icon: <Tv className="w-8 h-8 sm:w-10 sm:h-10" />,
    title: 'Multi-Dispositivos',
    description: 'Accede desde cualquier dispositivo, en cualquier momento'
  },
  {
    id: 'download',
    icon: <Download className="w-8 h-8 sm:w-10 sm:h-10" />,
    title: 'Descargar Contenido',
    description: 'Descarga tus videos favoritos y mira sin conexión'
  },
  {
    id: 'quality',
    icon: <Zap className="w-8 h-8 sm:w-10 sm:h-10" />,
    title: 'Calidad Premium',
    description: 'Disfruta de contenido en la máxima calidad disponible'
  }
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className="
      w-full px-4 sm:px-8 lg:px-16
      py-12 sm:py-16 lg:py-20
      bg-gradient-to-b from-transparent via-gray-900/30 to-transparent
    ">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="
              flex flex-col items-center text-center
              p-6 sm:p-8
              bg-gray-900/50 backdrop-blur-sm
              border border-gray-800/50
              rounded-xl
              hover:bg-gray-900/70
              hover:border-gray-700/50
              transition-all duration-300
              group
            "
          >
            {/* Icon */}
            <div className="
              flex items-center justify-center
              w-16 h-16 sm:w-20 sm:h-20
              mb-4 sm:mb-6
              bg-gradient-to-br from-cyan-500/20 to-blue-500/20
              rounded-full
              text-cyan-400
              group-hover:from-cyan-500/40 group-hover:to-blue-500/40
              group-hover:scale-110
              transition-all duration-300
            ">
              {feature.icon}
            </div>

            {/* Title */}
            <h3 className="
              text-lg sm:text-xl font-semibold text-white
              mb-2 sm:mb-3
            ">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="
              text-sm sm:text-base
              text-gray-400
              leading-relaxed
            ">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};