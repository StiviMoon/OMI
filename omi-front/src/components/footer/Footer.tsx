'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Mail, Globe, Github } from 'lucide-react';

interface FooterProps {
  onOpenAccountModal?: () => void;
  onOpenSearchModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAccountModal,onOpenSearchModal }) => {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Rutas que tienen sidebar
  const routesWithSidebar = ['/videos', '/about', '/historial', '/series', '/ninos', '/anime'];
  const hasSidebar = routesWithSidebar.some(route => pathname.startsWith(route));

  return (
    <footer 
      className={`
        bg-gradient-to-b from-gray-900 to-black border-t border-gray-800
        transition-all duration-300
        ${hasSidebar ? 'md:ml-[80px] lg:ml-[160px]' : ''}
      `}
    >
      {/* CTA Section */}
      <div className="px-4 sm:px-8 lg:px-16 py-12 sm:py-16 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
          Empieza a disfrutar hoy.
        </h2>
        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
          Únete a miles de usuarios que ya están disfrutando del mejor contenido
        </p>
      </div>

      {/* Main Footer Content */}
      <div className="px-4 sm:px-8 lg:px-16 py-12 border-t border-gray-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group w-fit">
              <Image 
                src="/logoo.png" 
                alt="MI Streaming Logo" 
                width={120}
                height={40}
                className="object-contain hover:opacity-80 transition-opacity"
                priority
              />
            </Link>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Convierte tu tiempo libre en momentos inolvidables. La plataforma de streaming más intuitiva y eficiente.
            </p>
            <div className="space-y-2">
              <a 
                href="mailto:contacto@omig.com" 
                className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                contacto@omi.com
              </a>
              <a 
                href="https://www.omi.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-sm"
              >
                <Globe className="w-4 h-4" />
                www.omi.com
              </a>
            </div>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navegación</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/videos" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  Mis videos
                </Link>
              </li>
              <li>
                <button 
                  onClick={onOpenAccountModal}
                  className="text-gray-400 hover:text-cyan-400 transition-colors text-sm text-left w-full"
                >
                  Mi cuenta
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenSearchModal}
                  className="text-gray-400 hover:text-cyan-400 transition-colors text-sm text-left w-full"
                  >
                  Explorar
                </button>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  Sobre nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h3 className="text-white font-semibold mb-4">Recursos</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  Tutoriales
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  API
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  Estado del servicio
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  Términos de servicio
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  Política de cookies
                </Link>
              </li>
              <li>
                <Link href="/gdpr" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  GDPR
                </Link>
              </li>
            </ul>
          </div>

          {/* Síguenos */}
          <div>
            <h3 className="text-white font-semibold mb-4">Síguenos</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://github.com/StiviMoon/OMI" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </li>
              <li>
                <a 
                  href="https://linkedin.com/omi" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
              </li>
              
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="px-4 sm:px-8 lg:px-16 py-6 border-t border-gray-800">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} OMI. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-gray-500 hover:text-cyan-400 transition-colors text-sm">
              Privacidad
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-cyan-400 transition-colors text-sm">
              Términos
            </Link>
            <Link href="/cookies" className="text-gray-500 hover:text-cyan-400 transition-colors text-sm">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};