'use client';

import { Film, Star, Play, HandHelping, Tags, Download } from 'lucide-react';
import Image from 'next/image';
import { Header } from '@/components/ui/header/Header';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface TeamMember {
  role: string;
  name: string;
}

const features: Feature[] = [
  {
    icon: <Film className="w-6 h-6" />,
    title: 'Catálogo Extenso',
    description: 'Miles de películas de todos los géneros y épocas'
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: 'Recomendaciones Personalizadas',
    description: 'Descubre contenido adaptado a tus gustos'
  },
  {
    icon: <Play className="w-6 h-6" />,
    title: 'Streaming de Calidad',
    description: 'Disfruta de video en HD y 4K sin interrupciones'
  }
];

const teamMembers: TeamMember[] = [
  { role: 'Backend Developer', name: 'Johan Steven Rodriguez Lopez' },
  { role: 'Frontend Developer', name: 'Daniel Alexander Ramirez Maigual' },
  { role: 'Tester', name: 'Alejandro Rubianes Realpe' },
  { role: 'Database', name: 'Carlos Daniel Salinas' },
  { role: 'Project Manager', name: 'Axel David Rubianes' }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Header onOpenLogin={() => {}} />
      
      <main className="w-full pt-20">
        <div className="bg-gradient-to-r from-zinc-900/80 via-zinc-800/60 to-zinc-900/80 backdrop-blur-sm border-b border-white/5 px-6 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="h-10 w-1 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full" />
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Sobre Nosotros</h1>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto p-6 sm:p-8 space-y-6 sm:space-y-8">
          {/* Hero Section */}
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <Image 
                src="/logoo.png" 
                alt="Logo" 
                width={128}
                height={128}
                className="w-32 h-auto object-contain hover:scale-110 transition-transform duration-300"
              />
            </div>
            <p className="text-xl text-gray-300 italic">
              Tu destino definitivo para el entretenimiento cinematográfico
            </p>
          </div>

          {/* Mission Statement */}
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 sm:p-8 border border-white/5 hover:border-cyan-500/30 transition-all duration-300">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-2 rounded-lg">
                <Star className="w-5 h-5 text-white" />
              </div>
              <span>Nuestra Misión</span>
            </h2>
            <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
              Creemos que el cine es más que entretenimiento, es una forma de arte que conecta culturas, 
              cuenta historias y nos hace sentir. Nuestra misión es acercar el mejor contenido cinematográfico 
              a todos los hogares, ofreciendo una experiencia de visualización excepcional que celebre la 
              magia del séptimo arte.
            </p>
          </div>

          {/* What We Offer Section */}
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 sm:p-8 border border-white/5 hover:border-cyan-500/30 transition-all duration-300">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <div className="bg-gradient-to-br from-cyan-400 to-cyan-600 p-2 rounded-lg">
                <HandHelping className="w-5 h-5 text-white" />
              </div>
              <span>¿Qué Ofrecemos?</span>
            </h2>
            <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
              Somos una plataforma de streaming diseñada para los amantes del cine. Desde clásicos 
              atemporales hasta los últimos estrenos de Hollywood, tenemos algo para cada tipo de 
              espectador. Con una interfaz intuitiva y tecnología de vanguardia, hacer maratones de 
              películas nunca había sido tan fácil.
            </p>
          </div>

          {/* Features Section */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 flex items-center gap-3">
              <div className="bg-gradient-to-br from-cyan-400 to-cyan-600 p-2 rounded-lg">
                <Play className="w-5 h-5 text-white" />
              </div>
              <span>Características Destacadas</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-lg p-6 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 group"
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="bg-gradient-to-br from-cyan-400 to-cyan-600 text-white p-4 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-2 text-lg">{feature.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Version Section */}
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 sm:p-8 border border-white/5 hover:border-cyan-500/30 transition-all duration-300 flex justify-center items-center">
            <div className="text-center">
              <div className="bg-gradient-to-br from-cyan-400 to-cyan-600 text-white p-3 rounded-lg inline-flex mb-3">
                <Tags className="w-6 h-6" />
              </div>
              <h3 className="text-white font-bold mb-1 text-lg">Versión</h3>
              <p className="text-gray-400 text-sm">V.1.0.4</p>
            </div>
          </div>


          {/* Team Section */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-6 border border-gray-700 flex justify-center">
            <div className="text-center w-full">
              <h3 className="text-white font-semibold mb-4">Integrantes</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {teamMembers.map((member, index) => (
                  <div key={index} className="card" data-text={member.role}>
                    <div className="first-content" />
                    <div className="second-content text-black-400 w-20 h-auto flex justify-center items-center">
                      <span>{member.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Manual de Usuario Section */}
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 sm:p-8 border border-white/5 hover:border-cyan-500/30 transition-all duration-300">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-br from-cyan-400 to-cyan-600 text-white p-4 rounded-lg">
                  <Download className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
              </div>
              <h3 className="text-white font-bold mb-2 text-lg sm:text-xl">Manual de Usuario</h3>
              <p className="text-gray-400 text-sm sm:text-base mb-6 max-w-md mx-auto">
                Descarga nuestra guía completa para aprovechar al máximo la plataforma
              </p>
              <a
                href="/manual-usuario.pdf"
                download="Manual_Usuario_Plataforma.pdf"
                className="inline-flex items-center gap-2 bg-zinc-800/50 hover:bg-zinc-700/50 border border-white/10 hover:border-cyan-500/50 rounded-lg px-6 py-3 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 text-white font-medium cursor-pointer hover:scale-105 active:scale-95"
              >
                <Download className="w-5 h-5" />
                Descargar Manual
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}