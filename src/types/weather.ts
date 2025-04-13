export interface WeatherData {
  location: string;
  temperature: string;
  condition: string;
  high: string;
  low: string;
  precipitation: string;
  humidity: string;
  windSpeed: string;
  weatherCode: string;
}

export interface WeatherResponse {
  naturalResponse: string;
  sessionId: string;
  weatherData: WeatherData;
  metadata: {
    currentTime: string;
  };
}

export interface WeatherRequest {
  location: string;
  query: string;
}