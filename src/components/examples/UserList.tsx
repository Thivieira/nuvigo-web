import React from 'react';
import { useUsers, useUserOperations } from '@/hooks';
import { User } from '@/services';

export function UserList() {
  const { data: users, isLoading, error, mutate } = useUsers();
  const { deleteUser } = useUserOperations();

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      // Revalidate the users list after deletion
      mutate();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users: {error}</div>;
  if (!users || users.length === 0) return <div>No users found</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Users</h2>
      <div className="space-y-4">
        {users.map((user: User) => (
          <div key={user.id} className="border p-4 rounded-md flex justify-between items-center">
            <div>
              <h3 className="font-medium">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <button
              onClick={() => handleDeleteUser(user.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 