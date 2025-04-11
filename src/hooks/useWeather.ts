import { useSwrApiWithError } from './useSwrApi';
import { WeatherResponse, weatherService } from '@/services';

// Hook for fetching weather information
export function useWeather(location: string | null, query: string | null, language: string = 'en') {
  const url = location && query
    ? `/weather?location=${encodeURIComponent(location)}&query=${encodeURIComponent(query)}&language=${language}`
    : null;

  return useSwrApiWithError<WeatherResponse>(url);
}

// Hook for weather operations
export function useWeatherOperations() {
  return {
    getWeather: weatherService.getWeather,
  };
} 