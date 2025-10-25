'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth';
import { useAuthContext } from '@/lib/context/AuthContext';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin?: () => void;
}

// Componente de indicador de requisito
const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
  <div className="flex items-center gap-2 text-xs">
    <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
      met ? 'bg-green-500' : 'bg-gray-700'
    }`}>
      {met && (
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
    <span className={met ? 'text-green-400' : 'text-gray-500'}>{text}</span>
  </div>
);

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onOpenLogin }) => {
  const router = useRouter();
  const { login } = useAuthContext();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSymbol: false,
    isValid: false
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevenir scroll del body cuando el modal está abierto
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

  // Limpiar formulario cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        firstName: '',
        lastName: '',
        age: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      setError('');
      setShowPassword(false);
      setShowConfirmPassword(false);
      setPasswordStrength({
        hasMinLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSymbol: false,
        isValid: false
      });
    }
  }, [isOpen]);

  // Función para validar la contraseña
  const validatePassword = (password: string) => {
    const checks = {
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/'`~]/.test(password),
      isValid: false
    };
    
    checks.isValid = checks.hasMinLength && checks.hasUpperCase && checks.hasLowerCase && checks.hasNumber && checks.hasSymbol;
    
    return checks;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Validar requisitos de contraseña
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setError('La contraseña no cumple con todos los requisitos de seguridad');
      return;
    }

    // Validar edad
    const age = parseInt(formData.age);
    if (isNaN(age) || age < 13 || age > 120) {
      setError('La edad debe estar entre 13 y 120 años');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: age,
      });

      // Usar el login del contexto que maneja todo
      login(response.data.user, response.data.token);
      
      // Cerrar el modal
      onClose();
      
      // Redirigir a videos
      router.push('/videos');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrarse';
      
      // Mensajes más amigables
      if (errorMessage.includes('already exists')) {
        setError('Este correo electrónico ya está registrado');
      } else if (errorMessage.includes('Age must be between')) {
        setError('La edad debe estar entre 13 y 120 años');
      } else {
        setError(errorMessage);
      }
      
      console.error('Error en registro:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Validar contraseña en tiempo real
    if (name === 'password') {
      setPasswordStrength(validatePassword(value));
    }
  };
  
  const handleLoginClick = () => {
    onClose(); 
    if (onOpenLogin) {
      setTimeout(() => {
        onOpenLogin();
      }, 100);
    }
  };

  if (!isOpen || !mounted) return null;

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
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal - Ancho aumentado */}
      <div className="relative z-10 w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto scrollbar-hide" style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        <div className="bg-gray-900/95 backdrop-blur-md rounded-lg shadow-2xl border border-gray-800 my-4">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20"
            type="button"
            disabled={isLoading}
          >
            <X className="h-6 w-6" />
          </button>

          {/* Content */}
          <div className="p-6">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-cyan-600 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              CREAR CUENTA
            </h2>
            <p className="text-gray-400 text-center text-sm mb-5">
              Únete y disfruta del mejor contenido
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Nombre y Apellido en 2 columnas */}
              <div className="grid grid-cols-2 gap-3">
                {/* First Name Input */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Nombre
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Juan"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Last Name Input */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Apellido
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Pérez"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Email y Edad en 2 columnas */}
              <div className="grid grid-cols-2 gap-3">
                {/* Email Input */}
                <div>
                  <label htmlFor="register-email" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Correo electrónico
                  </label>
                  <input
                    id="register-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="tu@email.com"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Age Input */}
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Edad
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="25"
                    required
                    min="13"
                    max="120"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 -mt-1">Debes tener al menos 13 años</p>

              {/* Contraseña y Confirmar contraseña en 2 columnas */}
              <div className="grid grid-cols-2 gap-3">
                {/* Password Input */}
                <div>
                  <label htmlFor="register-password" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="register-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 pr-12 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                      required
                      minLength={8}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded p-1 disabled:opacity-50"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 pr-12 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded p-1 disabled:opacity-50"
                      aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Password Requirements - En 2 columnas */}
              <div className="p-3 bg-gray-800/30 rounded-md border border-gray-700/50">
                <p className="text-xs font-medium text-gray-300 mb-2">La contraseña debe contener:</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  <PasswordRequirement met={passwordStrength.hasMinLength} text="Mínimo 8 caracteres" />
                  <PasswordRequirement met={passwordStrength.hasUpperCase} text="Una letra mayúscula" />
                  <PasswordRequirement met={passwordStrength.hasLowerCase} text="Una letra minúscula" />
                  <PasswordRequirement met={passwordStrength.hasNumber} text="Un número (0-9)" />
                  <PasswordRequirement met={passwordStrength.hasSymbol} text="Un símbolo (!@#$%^&*)" />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  disabled={isLoading}
                  className="mt-1 w-4 h-4 rounded border-gray-700 bg-gray-800 text-green-500 focus:ring-2 focus:ring-cyan-500"
                />
                <label htmlFor="terms" className="text-xs text-gray-400">
                  Acepto los{' '}
                  <Link href="/terms" className="text-cyan-500 hover:text-cyan-400 underline">
                    términos y condiciones
                  </Link>
                  {' '}y la{' '}
                  <Link href="/privacy" className="text-cyan-500 hover:text-cyan-400 underline">
                    política de privacidad
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white font-semibold py-2.5 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'CREANDO CUENTA...' : 'CREAR CUENTA'}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-5 text-center">
              <p className="text-gray-400 text-sm">
                ¿Ya tienes cuenta?{' '}
                <button 
                  onClick={handleLoginClick}
                  className="text-cyan-500 hover:text-cyan-400 font-semibold transition-colors disabled:opacity-50"
                  type="button"
                  disabled={isLoading}
                >
                  Inicia sesión aquí
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};