import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User as UserIcon, ChevronDown, X, Lock, Trash2, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { authApi } from '@/lib/api/auth';

interface ModalCuentaProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserData {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
}

interface PasswordData {
  current: string;
  new: string;
  confirm: string;
}

interface DeleteData {
  confirmText: string;
  password: string;
}

type Section = 'informacion' | 'editar' | 'seguridad' | 'eliminar';

export default function ModalCuenta({ isOpen, onClose }: ModalCuentaProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>('informacion');
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    age: 0,
    email: ''
  });
  const [editData, setEditData] = useState<UserData>(userData);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    current: '',
    new: '',
    confirm: ''
  });
  const [deleteData, setDeleteData] = useState<DeleteData>({
    confirmText: '',
    password: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // WCAG 2.1.1 - Cerrar con Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // WCAG 2.4.3 - Enfocar el modal al abrir
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // WCAG 2.4.3 - Atrapar el foco dentro del modal
  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  const handleLogout = () => {
    authApi.logout();
    localStorage.removeItem('user');
    onClose();
    router.push('/');
  };

  const loadUserProfile = useCallback(async () => {
    try {
      const response = await authApi.getProfile();
      const user = response.data.user;
      
      const userData: UserData = {
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        email: user.email,
      };
      
      setUserData(userData);
      setEditData(userData);
    } catch (err) {
      console.error('Error loading profile:', err);
      // Si falla, probablemente el token expiró
      handleLogout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cargar datos del usuario al abrir
  useEffect(() => {
    if (isOpen) {
      setActiveSection('informacion');
      loadUserProfile();
    }
  }, [isOpen, loadUserProfile]);

  const handleSaveProfile = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await authApi.updateProfile({
        firstName: editData.firstName,
        lastName: editData.lastName,
        age: editData.age,
        email: editData.email,
      });

      setUserData(editData);
      setSuccess('Perfil actualizado exitosamente');
      
      setTimeout(() => {
        setActiveSection('informacion');
        setSuccess('');
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setError('');
    setSuccess('');

    if (passwordData.new !== passwordData.confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (passwordData.new.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      await authApi.updateProfile({
        currentPassword: passwordData.current,
        newPassword: passwordData.new,
      });

      setSuccess('Contraseña actualizada exitosamente');
      setPasswordData({ current: '', new: '', confirm: '' });
      
      setTimeout(() => {
        setSuccess('');
        setActiveSection('informacion');
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setError('');

    if (deleteData.confirmText !== 'ELIMINAR') {
      setError('Debes escribir "ELIMINAR" para confirmar');
      return;
    }

    if (!deleteData.password) {
      setError('Debes ingresar tu contraseña');
      return;
    }

    setIsLoading(true);

    try {
      await authApi.deleteAccount({
        password: deleteData.password,
      });

      // Cerrar sesión y redirigir
      handleLogout();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Función para renderizar el contenido según la sección activa
  const renderContent = () => {
    switch (activeSection) {
      case 'informacion':
        return (
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-md text-sm">
                {success}
              </div>
            )}
            
            <div>
              <label 
                htmlFor="nombre-usuario"
                className="text-white font-medium text-xs sm:text-sm block mb-1"
              >
                Nombre:
              </label>
              <div 
                id="nombre-usuario"
                className="border-b border-white/30 pb-2 text-white text-sm sm:text-base"
              >
                {userData.firstName}
              </div>
            </div>
            
            <div>
              <label 
                htmlFor="apellido-usuario"
                className="text-white font-medium text-xs sm:text-sm block mb-1"
              >
                Apellido:
              </label>
              <div 
                id="apellido-usuario"
                className="border-b border-white/30 pb-2 text-white text-sm sm:text-base"
              >
                {userData.lastName}
              </div>
            </div>
            
            <div>
              <label 
                htmlFor="edad-usuario"
                className="text-white font-medium text-xs sm:text-sm block mb-1"
              >
                Edad:
              </label>
              <div 
                id="edad-usuario"
                className="border-b border-white/30 pb-2 text-white text-sm sm:text-base"
              >
                {userData.age}
              </div>
            </div>
            
            <div>
              <label 
                htmlFor="correo-usuario"
                className="text-white font-medium text-xs sm:text-sm block mb-1"
              >
                Correo:
              </label>
              <div 
                id="correo-usuario"
                className="border-b border-white/30 pb-2 text-white text-sm sm:text-base break-all"
              >
                {userData.email}
              </div>
            </div>
          </div>
        );

      case 'editar':
        return (
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-md text-sm">
                {success}
              </div>
            )}
            
            <div>
              <label 
                htmlFor="edit-nombre"
                className="text-white font-medium text-xs sm:text-sm block mb-1"
              >
                Nombre:
              </label>
              <input
                id="edit-nombre"
                type="text"
                value={editData.firstName}
                onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label 
                htmlFor="edit-apellido"
                className="text-white font-medium text-xs sm:text-sm block mb-1"
              >
                Apellido:
              </label>
              <input
                id="edit-apellido"
                type="text"
                value={editData.lastName}
                onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label 
                htmlFor="edit-edad"
                className="text-white font-medium text-xs sm:text-sm block mb-1"
              >
                Edad:
              </label>
              <input
                id="edit-edad"
                type="number"
                value={editData.age}
                onChange={(e) => setEditData({...editData, age: parseInt(e.target.value) || 0})}
                className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white"
                min="13"
                max="120"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label 
                htmlFor="edit-correo"
                className="text-white font-medium text-xs sm:text-sm block mb-1"
              >
                Correo:
              </label>
              <input
                id="edit-correo"
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({...editData, email: e.target.value})}
                className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white"
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white text-sm sm:text-base disabled:opacity-50"
              >
                {isLoading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
              </button>
              <button
                onClick={() => {
                  setEditData(userData);
                  setActiveSection('informacion');
                  setError('');
                  setSuccess('');
                }}
                disabled={isLoading}
                className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white text-sm sm:text-base disabled:opacity-50"
              >
                CANCELAR
              </button>
            </div>
          </div>
        );

      case 'seguridad':
        return (
          <div className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-md text-sm">
                {success}
              </div>
            )}
            
            <div className="bg-white/5 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-indigo-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-2">Cambiar Contraseña</h3>
                  <p className="text-white/70 text-sm">
                    Mantén tu cuenta segura actualizando tu contraseña regularmente.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label 
                  htmlFor="current-password"
                  className="text-white font-medium text-xs sm:text-sm block mb-1"
                >
                  Contraseña Actual:
                </label>
                <div className="relative">
                  <input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 pr-10 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="Ingresa tu contraseña actual"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded p-1"
                    aria-label={showCurrentPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label 
                  htmlFor="new-password"
                  className="text-white font-medium text-xs sm:text-sm block mb-1"
                >
                  Nueva Contraseña:
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 pr-10 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="Ingresa tu nueva contraseña"
                    minLength={6}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded p-1"
                    aria-label={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label 
                  htmlFor="confirm-password"
                  className="text-white font-medium text-xs sm:text-sm block mb-1"
                >
                  Confirmar Nueva Contraseña:
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 pr-10 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="Confirma tu nueva contraseña"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded p-1"
                    aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleChangePassword}
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white text-sm sm:text-base mt-4 disabled:opacity-50"
              >
                {isLoading ? 'ACTUALIZANDO...' : 'ACTUALIZAR CONTRASEÑA'}
              </button>
            </div>
          </div>
        );

      case 'eliminar':
        return (
          <div className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <Trash2 className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-red-400 font-semibold mb-2">Zona de Peligro</h3>
                  <p className="text-white/70 text-sm">
                    Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate de esto.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-white/80 text-sm">
              <p>Al eliminar tu cuenta:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Se borrarán todos tus datos personales</li>
                <li>Perderás acceso a todos tus contenidos</li>
                <li>Esta acción no se puede deshacer</li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-lg p-4 mt-4 space-y-4">
              <div>
                <label 
                  htmlFor="confirm-delete"
                  className="text-white font-medium text-xs sm:text-sm block mb-2"
                >
                  Para confirmar, escribe &quot;ELIMINAR&quot; en mayúsculas:
                </label>
                <input
                  id="confirm-delete"
                  type="text"
                  value={deleteData.confirmText}
                  onChange={(e) => setDeleteData({...deleteData, confirmText: e.target.value})}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="ELIMINAR"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label 
                  htmlFor="delete-password"
                  className="text-white font-medium text-xs sm:text-sm block mb-2"
                >
                  Ingresa tu contraseña para confirmar:
                </label>
                <div className="relative">
                  <input
                    id="delete-password"
                    type={showDeletePassword ? "text" : "password"}
                    value={deleteData.password}
                    onChange={(e) => setDeleteData({...deleteData, password: e.target.value})}
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 pr-10 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Tu contraseña"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded p-1"
                    aria-label={showDeletePassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showDeletePassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base disabled:opacity-50"
              >
                {isLoading ? 'ELIMINANDO...' : 'ELIMINAR CUENTA PERMANENTEMENTE'}
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        tabIndex={-1}
        aria-labelledby="modal-title"
        className="bg-gradient-to-br from-grey-200 via-grey-300 to-teal-800 rounded-2xl p-8 w-full max-w-5xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-white/80 transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded-lg p-1 z-10"
          aria-label="Cerrar modal de cuenta"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        
        <div className="flex items-center gap-2 mb-4 sm:mb-6 md:mb-8">
          <Image 
            src="/logoo.png" 
            alt="Logo de la aplicación" 
            width={48}
            height={48}
            className="w-15 h-15 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain" 
          />
        </div>

        <h1 
          id="modal-title"
          className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8"
        >
          MI CUENTA
        </h1>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 items-start">
          
          <nav 
            className="w-full lg:w-48 lg:mt-16"
            aria-label="Menú de opciones de cuenta"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-col gap-2 sm:gap-3">
              <button 
                onClick={() => setActiveSection('informacion')}
                className={`py-2 sm:py-3 px-3 sm:px-5 rounded-lg text-left font-medium transition-colors text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-white ${
                  activeSection === 'informacion' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-700/60 hover:bg-gray-600/60 text-white'
                }`}
                aria-label="Ver información de la cuenta"
                aria-pressed={activeSection === 'informacion'}
              >
                Informacion
              </button>
              <button 
                onClick={() => setActiveSection('editar')}
                className={`py-2 sm:py-3 px-3 sm:px-5 rounded-lg text-left font-medium transition-colors text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-white ${
                  activeSection === 'editar' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-700/60 hover:bg-gray-600/60 text-white'
                }`}
                aria-label="Editar perfil de usuario"
                aria-pressed={activeSection === 'editar'}
              >
                Editar perfil
              </button>
              <button 
                onClick={() => setActiveSection('seguridad')}
                className={`py-2 sm:py-3 px-3 sm:px-5 rounded-lg text-left font-medium transition-colors text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-white ${
                  activeSection === 'seguridad' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-700/60 hover:bg-gray-600/60 text-white'
                }`}
                aria-label="Configuración de seguridad"
                aria-pressed={activeSection === 'seguridad'}
              >
                Seguridad
              </button>
              <button 
                onClick={() => setActiveSection('eliminar')}
                className={`py-2 sm:py-3 px-3 sm:px-5 rounded-lg text-left font-medium transition-colors text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-white ${
                  activeSection === 'eliminar' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-700/60 hover:bg-gray-600/60 text-white'
                }`}
                aria-label="Eliminar perfil permanentemente"
                aria-pressed={activeSection === 'eliminar'}
              >
                Eliminar Perfil
              </button>
            </div>
          </nav>

          <div className="flex-1 w-full">
            
            <div className="flex justify-center lg:justify-end mb-4 sm:mb-6">
              <div 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white/40 flex items-center justify-center"
                aria-label="Foto de perfil"
              >
                <UserIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={1.5} />
              </div>
            </div>

            <div className="mb-4 sm:mb-6 md:mb-8">
              {renderContent()}
            </div>

            {activeSection === 'informacion' && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button 
                  onClick={() => setActiveSection('editar')}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white text-sm sm:text-base"
                  aria-label="Editar información del perfil"
                >
                  EDITAR PERFIL
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white text-sm sm:text-base"
                  aria-label="Cerrar sesión y volver al inicio"
                >
                  CERRAR SESION
                </button>
              </div>
            )}
          </div>
        </div>

        <footer className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 md:gap-12 mt-6 sm:mt-8 md:mt-12 pt-4 sm:pt-6 border-t border-white/10">
          <button 
            className="text-white text-xs sm:text-sm font-medium hover:text-white/80 transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded px-2 py-1"
            aria-label="Obtener ayuda"
          >
            Ayuda
          </button>
          <button 
            className="text-white text-xs sm:text-sm font-medium flex items-center gap-2 hover:text-white/80 transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded px-2 py-1"
            aria-label="Ver terminos y condiciones"
          >
            Terminos y Condiciones
            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
          </button>
        </footer>
      </div>
    </div>
  );
}