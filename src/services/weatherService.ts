import { axiosInstance } from '../lib/axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

// Weather response type
export interface WeatherResponse {
  location: string;
  temperature: string;
  condition: string;
  high: string;
  low: string;
  humidity: string;
  windSpeed: string;
  precipitation: string;
  weatherCode: number;
}

// Weather service functions
export const weatherService = {
  // Get weather information for a specific location
  async getWeather(location: string, query: string | null = null, language: string = 'pt'): Promise<WeatherResponse> {
    const url = query
      ? `/weather/query?location=${encodeURIComponent(location)}&query=${encodeURIComponent(query)}&language=${language}`
      : `/weather/location?location=${encodeURIComponent(location)}`;

    const response = await axiosInstance.get<WeatherResponse>(url);
    return response.data;
  },

  // Get weather information by coordinates
  async getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherResponse> {
    const url = `/weather/location?lat=${lat}&lon=${lon}`;
    const response = await axiosInstance.get<WeatherResponse>(url);
    return response.data;
  }
}; 