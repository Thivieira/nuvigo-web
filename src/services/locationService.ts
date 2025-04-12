import { axiosInstance } from '../lib/axios';

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
  try {
    const { data } = await axiosInstance.get<{ locations: Location[] }>('/location', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch locations');
  }
};

/**
 * Creates a new location for the authenticated user
 */
export const createLocation = async (accessToken: string, data: CreateLocationRequest): Promise<Location> => {
  try {
    const { data: responseData } = await axiosInstance.post<Location>('/location', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return responseData;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create location');
  }
};

/**
 * Sets a location as active
 */
export const setActiveLocation = async (accessToken: string, locationId: string): Promise<Location> => {
  try {
    const { data } = await axiosInstance.patch<Location>(`/location/${locationId}/active`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to set active location');
  }
};

/**
 * Deletes a location
 */
export const deleteLocation = async (accessToken: string, locationId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/location/${locationId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete location');
  }
}; 