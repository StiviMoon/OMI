'use client';

import React from 'react';
import { Film, Star, Play, HandHelping, Tags } from 'lucide-react';
import Image from 'next/image';
import { Sidebar } from '@/components/ui/sidebar/sidebar';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const AboutPage: React.FC = () => {
  const features: Feature[] = [
    {
      icon: <Film className="w-6 h-6" />,
      title: "Catálogo Extenso",
      description: "Miles de películas de todos los géneros y épocas"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Recomendaciones Personalizadas",
      description: "Descubre contenido adaptado a tus gustos"
    },
    {
      icon: <Play className="w-6 h-6" />,
      title: "Streaming de Calidad",
      description: "Disfruta de video en HD y 4K sin interrupciones"
    }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content - con margen para el sidebar */}
      <main className="flex-1 md:ml-[80px] lg:ml-[160px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-grey-200 via-grey-200 to-grey-400 px-6 py-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-white">Sobre Nosotros</h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto p-6 space-y-8">
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
          <div className="bg-gray-900 bg-opacity-50 rounded-lg p-6 border border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400" />
              Nuestra Misión
            </h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              Creemos que el cine es más que entretenimiento, es una forma de arte que conecta culturas, 
              cuenta historias y nos hace sentir. Nuestra misión es acercar el mejor contenido cinematográfico 
              a todos los hogares, ofreciendo una experiencia de visualización excepcional que celebre la 
              magia del séptimo arte.
            </p>
          </div>

          {/* What We Offer Section */}
          <div className="bg-gray-900 bg-opacity-50 rounded-lg p-6 border border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-3">
              <HandHelping className="w-6 h-6 text-green-400 inline-block mr-2" />
              ¿Qué Ofrecemos?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Somos una plataforma de streaming diseñada para los amantes del cine. Desde clásicos 
              atemporales hasta los últimos estrenos de Hollywood, tenemos algo para cada tipo de 
              espectador. Con una interfaz intuitiva y tecnología de vanguardia, hacer maratones de 
              películas nunca había sido tan fácil.
            </p>
          </div>

          {/* Features Section */}
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <Play className="w-6 h-6 text-cyan-500" />
              Características Destacadas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-5 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="bg-gradient-to-br from-cyan-200 to-cyan-600 text-white p-3 rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Version Section */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-6 border border-gray-700 flex justify-center items-center">
            <div className="text-center">
              <div>
                <Tags className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              </div>
              <h3 className="text-white font-semibold mb-1">Version</h3>
              <p className="text-gray-400 text-sm">V.1.0.0</p>
            </div>
          </div>

        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-6 border border-gray-700 flex justify-center">
            <div className="text-center">
              
              <h3 className="text-white font-semibold mb-1">Integrantes</h3>
              
              <div className="flex flex-wrap justify-center gap-3">
                <div className="card" data-text="Backend Developer">
                    <div className="first-content">
                        
                    </div>
                    <div className="second-content text-black-400 w-20 h-auto justify-center items-center ">
                        <span>Johan Steven Rodriguez Lopez</span>
                    </div>

                </div>
                <div className="card" data-text="Frontend Developer">
                    <div className="first-content ">    
                    </div>
                    <div className="second-content text-black-400 w-20 h-auto flex justify-center items-center">
                        <span>Daniel Alexander Ramirez Maigual</span>
                    </div>
                    
                </div>
                <div className="card" data-text="Tester">
                    <div className="first-content">
                        
                    </div>
                    <div className="second-content text-black-400 w-20 h-auto flex justify-center items-center">
                        <span>Alejandro Rubianes Realpe</span>
                    </div>
                    
                </div>
                <div className="card" data-text="Database Admin">
                    <div className="first-content">
                        
                    </div>
                    <div className="second-content text-black-400 w-20 h-auto flex justify-center items-center">
                        <span>Carlos Daniel Salinas</span>
                    </div>
                    
                </div>
                <div className="card" data-text="Project Manager">
                    <div className="first-content">
                        
                    </div>
                    <div className="second-content text-black-400 w-20 h-auto flex justify-center items-center">
                        <span>Axel David Rubianes</span>
                    </div>
                    
                </div>
              </div>
            </div>
        </div>
    </div>

        
       
      </main>
    </div>
  );
};

export default AboutPage;