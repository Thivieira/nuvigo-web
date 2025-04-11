import { useSwrApiWithError } from './useSwrApi';
import { User } from '@/services/authService';
import { userService } from '@/services';

// Hook for fetching all users
export function useUsers() {
  return useSwrApiWithError<User[]>('/users');
}

// Hook for fetching a single user by ID
export function useUser(id: string | null) {
  return useSwrApiWithError<User>(id ? `/users/${id}` : null);
}

// Hook for user management operations
export function useUserOperations() {
  return {
    createUser: userService.createUser,
    updateUser: userService.updateUser,
    deleteUser: userService.deleteUser,
  };
} 