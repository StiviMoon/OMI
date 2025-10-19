// Servicio de API para autenticación

import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  DeleteAccountRequest,
  ProfileResponse,
  MessageResponse,
  ErrorResponse,
} from '../types/auth.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_BASE = `${API_URL}/api/auth`;

// Helper para manejar respuestas
const handleResponse = async <T,>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type');
  
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('El servidor no está respondiendo correctamente');
  }

  const data = await response.json();

  if (!response.ok) {
    const errorData = data as ErrorResponse;
    throw new Error(errorData.error || 'Error en la petición');
  }

  return data as T;
};

// Helper para obtener el token del localStorage
const getAuthHeader = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return token
    ? {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    : { 'Content-Type': 'application/json' };
};

export const authApi = {
  /**
   * Registrar nuevo usuario
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    return handleResponse<AuthResponse>(response);
  },

  /**
   * Iniciar sesión
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    return handleResponse<AuthResponse>(response);
  },

  /**
   * Obtener perfil del usuario autenticado
   */
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await fetch(`${API_BASE}/profile`, {
      method: 'GET',
      headers: getAuthHeader(),
    });

    return handleResponse<ProfileResponse>(response);
  },

  /**
   * Actualizar perfil del usuario
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<ProfileResponse> => {
    const response = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });

    return handleResponse<ProfileResponse>(response);
  },

  /**
   * Eliminar cuenta
   */
  deleteAccount: async (data: DeleteAccountRequest): Promise<MessageResponse> => {
    const response = await fetch(`${API_BASE}/account`, {
      method: 'DELETE',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });

    return handleResponse<MessageResponse>(response);
  },

  /**
   * Solicitar recuperación de contraseña
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<MessageResponse> => {
    const response = await fetch(`${API_BASE}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    return handleResponse<MessageResponse>(response);
  },

  /**
   * Restablecer contraseña con token
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<MessageResponse> => {
    const response = await fetch(`${API_BASE}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    return handleResponse<MessageResponse>(response);
  },

  /**
   * Cerrar sesión (solo limpia localStorage)
   */
  logout: () => {
    localStorage.removeItem('token');
  },

  /**
   * Verificar si hay un token válido
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  /**
   * Obtener el token actual
   */
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
};

