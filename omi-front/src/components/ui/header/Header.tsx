'use client';

import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoginModal } from '@/components/ui/auth/LoginModal';
import { RegisterModal } from '@/components/ui/auth/RegisterModal'; 
import Image from 'next/image';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false); 

  return (
    <header className="
      fixed top-0 left-0 right-0 z-50 
      bg-black/40 backdrop-blur-md border-b border-gray-800/50
    ">
      <div className="flex items-center justify-between px-4 sm:px-8 lg:px-16 py-4">
        {/* Logo */}
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14">
          <Image
            src="/logoo.png"
            alt="OMI Logo"
            fill
            className="object-contain"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {/* Auth Buttons */}
          <Button
            variant="ghost"
            className="text-white border border-gray-700 hover:text-white hover:bg-transparent hover-underline-effect"
            onClick={() => setIsLoginModalOpen(true)}
          >
            Iniciar Sesión 
          </Button>
          
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="
                flex items-center gap-2 px-3 py-2 rounded-lg
                text-gray-300 hover:text-white
                hover:bg-gray-800/50
                transition-all
                text-sm
              "
            >
              <span>Español</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {isLanguageOpen && (
              <div className="
                absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-700 rounded-lg
                shadow-lg z-50
              ">
                <button className="w-full text-left px-4 py-2 text-white hover:bg-gray-800 transition-colors rounded-t-lg">
                  Español
                </button>
                <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                  English
                </button>
                <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors rounded-b-lg">
                  Português
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-4 space-y-4">
          {/* Language Selector Mobile */}
          <div className="space-y-2">
            <p className="text-xs uppercase text-gray-500 font-semibold">Idioma</p>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
                Español
              </button>
              <button className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                English
              </button>
              <button className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                Português
              </button>
            </div>
          </div>

          {/* Auth Buttons Mobile */}
          <div className="space-y-2 pt-4 border-t border-gray-800">
            <Button
              variant="ghost"
              className="w-full text-gray-300 hover:text-white border border-gray-700"
              onClick={() => setIsLoginModalOpen(true)}
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onOpenRegister={() => setIsRegisterModalOpen(true)} 
      />
      <RegisterModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)} 
      />
    </header>
  );
};