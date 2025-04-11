const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

export interface Location {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLocationRequest {
  name: string;
}

/**
 * Gets all locations for the authenticated user
 */
export const getLocations = async (accessToken: string): Promise<{ locations: Location[] }> => {
  const response = await fetch(`${API_URL}/location`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch locations');
  }

  return response.json();
};

/**
 * Creates a new location for the authenticated user
 */
export const createLocation = async (accessToken: string, data: CreateLocationRequest): Promise<Location> => {
  const response = await fetch(`${API_URL}/location`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create location');
  }

  return response.json();
};

/**
 * Sets a location as active
 */
export const setActiveLocation = async (accessToken: string, locationId: string): Promise<Location> => {
  const response = await fetch(`${API_URL}/location/${locationId}/active`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to set active location');
  }

  return response.json();
};

/**
 * Deletes a location
 */
export const deleteLocation = async (accessToken: string, locationId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/location/${locationId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete location');
  }
}; 