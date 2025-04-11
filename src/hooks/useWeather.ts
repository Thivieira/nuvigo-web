import { useSwrApiWithError } from './useSwrApi';
import { WeatherResponse, weatherService } from '@/services';
import { useAuth } from '@/contexts/auth-context';

interface WeatherQueryParams {
  location?: string;
  lat?: number;
  lon?: number;
  query?: string;
  language?: string;
}

// Weather-specific cache configuration
const weatherCacheOptions = {
  dedupingInterval: 300000, // 5 minutes
  refreshInterval: 900000, // 15 minutes
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  errorRetryCount: 2,
  // Keep data in cache even when window is hidden or network is lost
  revalidateIfStale: false,
  // Keep showing old data while revalidating
  keepPreviousData: true,
};

// Hook for fetching weather information
export function useWeather(params: WeatherQueryParams) {
  const { tokens } = useAuth();
  const { location, lat, lon, query, language = 'pt' } = params;

  const url = location
    ? query
      ? `/weather/query?location=${encodeURIComponent(location)}&query=${encodeURIComponent(query)}&language=${language}`
      : `/weather/location?location=${encodeURIComponent(location)}`
    : lat && lon
      ? `/weather/location?lat=${lat}&lon=${lon}`
      : null;

  return useSwrApiWithError<WeatherResponse>(url, tokens?.accessToken, weatherCacheOptions);
}

// Hook for weather operations
export function useWeatherOperations() {
  return {
    getWeather: weatherService.getWeather,
    getWeatherByCoordinates: weatherService.getWeatherByCoordinates,
  };
} 