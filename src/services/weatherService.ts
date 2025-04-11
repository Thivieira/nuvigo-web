const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

// Weather response type
export interface WeatherResponse {
  location: string;
  temperature: string;
  condition: string;
  naturalResponse: string;
}

/**
 * Gets weather information for a specific location
 */
export const getWeather = async (accessToken: string, location: string, query: string, language: string = 'pt'): Promise<WeatherResponse> => {
  const response = await fetch(
    `${API_URL}/weather?location=${encodeURIComponent(location)}&query=${encodeURIComponent(query)}&language=${language}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Falha ao obter informações meteorológicas');
  }

  return response.json();
}; 