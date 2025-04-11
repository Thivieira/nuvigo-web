import { axiosInstance } from '../lib/axios';
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
  try {
    const { data } = await axiosInstance.get<User>('/auth/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Falha ao obter perfil do usuário');
  }
};

/**
 * Updates the current user's profile
 */
export const updateUserProfile = async (accessToken: string, data: { name?: string; email?: string; phone?: string }): Promise<User> => {
  try {
    const { data: responseData } = await axiosInstance.put<User>('/user', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return responseData;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Falha ao atualizar perfil do usuário');
  }
};

/**
 * Changes the user's password
 */
export const changePassword = async (accessToken: string, data: { oldPassword: string; newPassword: string }): Promise<{ success: boolean; message: string }> => {
  try {
    await axiosInstance.post('/auth/change-password', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return {
      success: true,
      message: 'Senha alterada com sucesso'
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Falha ao alterar a senha');
  }
}; 