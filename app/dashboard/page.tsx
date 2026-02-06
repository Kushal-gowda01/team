'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AQIDisplay from '@/components/AQIDisplay';
import SearchForm from '@/components/SearchForm';
import { logger } from '@/lib/logger';

interface AQIData {
  aqi: number;
  category: string;
  cityName: string;
  timestamp: string;
  dominantPollutant: string;
  temperature?: number;
  humidity?: number;
  pressure?: number;
  pollutants?: {
    pm25?: number;
    pm10?: number;
    o3?: number;
    no2?: number;
    so2?: number;
    co?: number;
  };
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="text-2xl font-bold text-blue-600">AIR Dashboard</div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const cityParam = searchParams.get('city');
  
  const [city, setCity] = useState<string | null>(cityParam);
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [isLoading, setIsLoading] = useState(!!cityParam);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAQI = async () => {
      if (!city) {
        setAqiData(null);
        setError('');
        return;
      }

      setIsLoading(true);
      setError('');
      const context = `DASHBOARD_FETCH_${city}`;

      try {
        logger.info(`Fetching AQI data for: ${city}`, context);

        const response = await fetch(`/api/aqi?city=${encodeURIComponent(city)}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.error || `HTTP Error: ${response.status}`;
          logger.error(`Failed to fetch AQI: ${errorMessage}`, context, errorMessage);
          throw new Error(errorMessage);
        }

        const data = await response.json();
        logger.info(`Successfully received AQI data for ${city}`, context, {
          aqi: data.aqi,
          dominantPollutant: data.dominantPollutant,
        });

        setAqiData(data);
      } catch (err) {
        let errorMessage = 'Failed to fetch AQI data';
        
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === 'string') {
          errorMessage = err;
        } else if (err && typeof err === 'object' && 'message' in err) {
          errorMessage = (err as any).message;
        }
        
        logger.error(`Error fetching AQI for ${city}`, context, errorMessage);
        setError(errorMessage);
        setAqiData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAQI();
  }, [city]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              AIR Dashboard
            </Link>
            <nav className="flex gap-6">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/community"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Community
              </Link>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = (e.target as HTMLFormElement).querySelector('input') as HTMLInputElement;
                if (input.value.trim()) {
                  setCity(input.value.trim());
                }
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Search city..."
                defaultValue={city || ''}
                className="flex-1 px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading air quality data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Data</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <p className="text-sm text-red-600 mb-4">
                Make sure you've entered a valid city name and that the OPENWEATHER_API_KEY environment variable is configured in Vercel.
              </p>
              <button
                onClick={() => setCity(null)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Clear Search
              </button>
            </div>
          </div>
        ) : aqiData ? (
          <AQIDisplay
            aqi={aqiData.aqi}
            dominantPollutant={aqiData.dominantPollutant}
            temperature={aqiData.temperature}
            humidity={aqiData.humidity}
            pressure={aqiData.pressure}
            city={aqiData.cityName}
            timestamp={aqiData.timestamp}
            pollutants={aqiData.pollutants}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">🌍</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to AIR Dashboard</h2>
              <p className="text-gray-600 mb-8">
                Enter a city name above to view current air quality data and health recommendations
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <p className="text-gray-600 font-medium">Try searching for popular cities:</p>
              <div className="flex flex-wrap gap-3 justify-center">
                {['London', 'New York', 'Delhi', 'Tokyo', 'Sydney', 'Paris'].map((cityName) => (
                  <button
                    key={cityName}
                    onClick={() => setCity(cityName)}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                  >
                    {cityName}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
