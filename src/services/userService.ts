import axiosInstance from '../lib/axios';
import { User } from './authService';

// Create user request type
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

// Update user request type
export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

// User service functions
export const userService = {
  // Get all users
  async getAllUsers(): Promise<User[]> {
    const response = await axiosInstance.get<User[]>('/users');
    return response.data;
  },

  // Get user by ID
  async getUserById(id: string): Promise<User> {
    const response = await axiosInstance.get<User>(`/users/${id}`);
    return response.data;
  },

  // Create user
  async createUser(data: CreateUserRequest): Promise<User> {
    const response = await axiosInstance.post<User>('/users', data);
    return response.data;
  },

  // Update user
  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    const response = await axiosInstance.put<User>(`/users/${id}`, data);
    return response.data;
  },

  // Delete user
  async deleteUser(id: string): Promise<void> {
    await axiosInstance.delete(`/users/${id}`);
  }
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

/**
 * Gets the current user's profile
 */
export const getCurrentUser = async (accessToken: string): Promise<User> => {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Falha ao obter perfil do usuário');
  }

  return response.json();
};

/**
 * Updates the current user's profile
 */
export const updateUserProfile = async (accessToken: string, data: { name?: string; email?: string; phone?: string }): Promise<User> => {
  const response = await fetch(`${API_URL}/user`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Falha ao atualizar perfil do usuário');
  }

  return response.json();
};

/**
 * Changes the user's password
 */
export const changePassword = async (accessToken: string, data: { oldPassword: string; newPassword: string }): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_URL}/auth/change-password`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || 'Falha ao alterar a senha');
  }

  return {
    success: true,
    message: 'Senha alterada com sucesso'
  };
}; 