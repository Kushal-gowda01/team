'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logger } from '@/lib/logger';

export default function SearchForm() {
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      logger.info(`User searching for city: ${city}`, 'SEARCH_FORM');
      // Redirect to dashboard with city query parameter
      router.push(`/dashboard?city=${encodeURIComponent(city)}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      logger.error('Search form error', 'SEARCH_FORM', errorMessage);
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
      <div className="flex gap-4">
        <input
          type="text"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setError('');
          }}
          placeholder="Enter your city name..."
          className="flex-1 px-6 py-4 text-lg text-gray-900 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 transition-all"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors disabled:cursor-not-allowed"
        >
          {isLoading ? 'Searching...' : 'Check AQI'}
        </button>
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </form>
  );
}
