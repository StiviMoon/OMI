// Tipos para el sistema de autenticación

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  age?: number;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface DeleteAccountRequest {
  password: string;
}

export interface ProfileResponse {
  message: string;
  data: {
    user: User;
  };
}

export interface MessageResponse {
  message: string;
  token?: string; // Solo en desarrollo para forgot-password
}

export interface ErrorResponse {
  error: string;
}

