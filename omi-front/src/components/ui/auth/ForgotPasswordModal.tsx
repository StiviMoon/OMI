'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/api/auth';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ 
  isOpen, 
  onClose, 
  onBack 
}) => {
  const [email, setEmail] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [devToken, setDevToken] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setError('');
      setSuccess(false);
      setDevToken('');
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authApi.forgotPassword({ email });
      
      setSuccess(true);
      
      // En desarrollo, el backend devuelve el token
      if (response.token) {
        setDevToken(response.token);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al solicitar recuperación');
      console.error('Error en forgot password:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    onClose();
    onBack?.();
  };

  const modalContent = (
    <div 
      className="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center p-4"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh' 
      }}
    >
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="bg-gray-900/95 backdrop-blur-md rounded-lg shadow-2xl border border-gray-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20"
            type="button"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="p-8">
            {!success ? (
              <>
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center">
                    <Mail className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-white text-center mb-2">
                  RECUPERAR CONTRASEÑA
                </h2>
                <p className="text-gray-400 text-center text-sm mb-8">
                  Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-300 mb-2">
                      Correo electrónico
                    </label>
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="tu@email.com"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white font-semibold py-3 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'ENVIANDO...' : 'ENVIAR ENLACE'}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <button 
                    onClick={handleBack}
                    className="text-gray-400 hover:text-cyan-400 text-sm transition-colors disabled:opacity-50"
                    type="button"
                    disabled={isLoading}
                  >
                    ← Volver al inicio de sesión
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white text-center mb-4">
                  ¡CORREO ENVIADO!
                </h2>
                
                <p className="text-gray-300 text-center mb-6">
                  Hemos enviado un enlace de recuperación a:
                  <br />
                  <span className="font-semibold text-white">{email}</span>
                </p>

                <div className="bg-blue-500/10 border border-blue-500 rounded-md p-4 mb-6">
                  <p className="text-blue-400 text-sm">
                    ℹ️ Revisa tu bandeja de entrada y sigue las instrucciones. El enlace expirará en 1 hora.
                  </p>
                </div>

                {devToken && (
                  <div className="bg-yellow-500/10 border border-yellow-500 rounded-md p-4 mb-6">
                    <p className="text-yellow-400 text-xs mb-2 font-semibold">
                      🔧 MODO DESARROLLO
                    </p>
                    <p className="text-gray-300 text-xs mb-2">
                      Token de reset:
                    </p>
                    <code className="block text-xs text-yellow-300 bg-gray-800 p-2 rounded break-all">
                      {devToken}
                    </code>
                    <p className="text-gray-400 text-xs mt-2">
                      Usa este token en la página de restablecer contraseña
                    </p>
                  </div>
                )}

                <Button
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-md transition-all"
                >
                  ENTENDIDO
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

