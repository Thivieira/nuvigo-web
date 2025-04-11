import React, { useState } from 'react';
import { useWeather } from '@/hooks';

export function WeatherInfo() {
  const [location, setLocation] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const { data: weather, isLoading, error } = useWeather(
    isSearching ? location : null,
    isSearching ? query : null
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Weather Information</h2>

      <form onSubmit={handleSearch} className="mb-6 space-y-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter location (e.g., Rio de Janeiro)"
            required
          />
        </div>

        <div>
          <label htmlFor="query" className="block text-sm font-medium text-gray-700">
            Query
          </label>
          <input
            type="text"
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter your question (e.g., How will it be on Friday afternoon?)"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Get Weather
        </button>
      </form>

      {isLoading && <div>Loading weather information...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}

      {weather && (
        <div className="border p-4 rounded-md">
          <h3 className="font-medium text-lg mb-2">Weather in {weather.location}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Temperature</p>
              <p className="font-medium">{weather.temperature}</p>
            </div>
            <div>
              <p className="text-gray-600">Condition</p>
              <p className="font-medium">{weather.condition}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-600">Response</p>
            <p className="font-medium">{weather.naturalResponse}</p>
          </div>
        </div>
      )}
    </div>
  );
} 