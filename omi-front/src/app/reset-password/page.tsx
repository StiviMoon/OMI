'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/api/auth';

const MIN_PASSWORD_LENGTH = 6;
const REDIRECT_DELAY = 3000;

const ResetPasswordContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setError('Token de recuperación no válido');
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const validatePasswords = (): boolean => {
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePasswords() || !token) {
      if (!token) setError('Token no válido');
      return;
    }

    setIsLoading(true);

    try {
      await authApi.resetPassword({
        token,
        newPassword: password,
      });

      setSuccess(true);
      setTimeout(() => router.push('/'), REDIRECT_DELAY);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al restablecer contraseña';
      
      if (errorMessage.includes('Invalid or expired')) {
        setError('El enlace ha expirado o no es válido. Solicita uno nuevo.');
      } else {
        setError(errorMessage);
      }
      
      console.error('Error en reset password:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);
  const isFormDisabled = isLoading || !token;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900/95 backdrop-blur-md rounded-lg shadow-2xl border border-gray-800 p-8">
          {!success ? (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Lock className="w-10 h-10 text-white" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-white text-center mb-2">
                NUEVA CONTRASEÑA
              </h1>
              <p className="text-gray-400 text-center text-sm mb-8">
                Ingresa tu nueva contraseña
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Nueva contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                      required
                      minLength={MIN_PASSWORD_LENGTH}
                      disabled={isFormDisabled}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Mínimo {MIN_PASSWORD_LENGTH} caracteres</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                      required
                      disabled={isFormDisabled}
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isFormDisabled}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'RESTABLECIENDO...' : 'RESTABLECER CONTRASEÑA'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button 
                  onClick={() => router.push('/')}
                  className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                  type="button"
                >
                  ← Volver al inicio
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white text-center mb-4">
                ¡CONTRASEÑA ACTUALIZADA!
              </h2>
              
              <p className="text-gray-300 text-center mb-6">
                Tu contraseña ha sido restablecida exitosamente.
              </p>

              <div className="bg-green-500/10 border border-green-500 rounded-md p-4 mb-6">
                <p className="text-green-400 text-sm text-center">
                  ✓ Ahora puedes iniciar sesión con tu nueva contraseña
                </p>
              </div>

              <p className="text-gray-400 text-center text-sm">
                Redirigiendo al inicio en {REDIRECT_DELAY / 1000} segundos...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
    <div className="text-white text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
      <p>Cargando...</p>
    </div>
  </div>
);

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
