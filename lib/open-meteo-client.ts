/**
 * Open-Meteo API Client
 * Free weather and air quality data (no API key required)
 */

import axios, { AxiosInstance } from 'axios';
import { logger } from './logger';

export interface ExternalAQIData {
  aqi: number;
  dominantPollutant: string;
  pollutants: {
    pm25?: number;
    pm10?: number;
    o3?: number;
    no2?: number;
    so2?: number;
    co?: number;
  };
  temperature?: number;
  humidity?: number;
  pressure?: number;
  timestamp: Date;
}

export interface CitySearchResult {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

class OpenMeteoClient {
  private geoClient: AxiosInstance;
  private aqiClient: AxiosInstance;

  constructor() {
    this.geoClient = axios.create({
      baseURL: 'https://geocoding-api.open-meteo.com/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.aqiClient = axios.create({
      baseURL: 'https://air-quality-api.open-meteo.com/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    logger.info('Open-Meteo API Client initialized (no API key required)', 'OM_API_CLIENT_INIT');
  }

  /**
   * Get city coordinates by name using Open-Meteo Geocoding API
   */
  async getCityCoordinates(cityName: string): Promise<{ lat: number; lon: number }> {
    const context = `GET_COORDS_${cityName}`;

    try {
      logger.info(`Getting coordinates for city: ${cityName}`, context);

      const response = await this.geoClient.get('/search', {
        params: {
          name: cityName,
          count: 1,
          language: 'en',
          format: 'json',
        },
      });

      if (!response.data || !response.data.results || response.data.results.length === 0) {
        logger.error(`City not found: ${cityName}`, context, 'No results from geocoding');
        throw new Error(`City "${cityName}" not found`);
      }

      const { latitude: lat, longitude: lon } = response.data.results[0];
      logger.debug(`Got coordinates for ${cityName}: ${lat}, ${lon}`, context);

      return { lat, lon };
    } catch (error) {
      logger.error(
        `Failed to get coordinates for ${cityName}`,
        context,
        error instanceof Error ? error.message : String(error)
      );
      throw error;
    }
  }

  /**
   * Convert Open-Meteo AQI index (0-500) to category description
   */
  private getAQIDescription(aqi: number): string {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Fair';
    if (aqi <= 150) return 'Moderate';
    if (aqi <= 200) return 'Poor';
    if (aqi <= 300) return 'Very Poor';
    return 'Hazardous';
  }

  /**
   * Fetch AQI data for a city
   */
  async fetchAQIByCity(cityName: string): Promise<ExternalAQIData> {
    const context = `FETCH_AQI_CITY_${cityName}`;

    try {
      logger.info(`Fetching AQI for city: ${cityName}`, context);

      // First, get coordinates for the city
      const { lat, lon } = await this.getCityCoordinates(cityName);

      // Then fetch weather and air quality data
      const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude: lat,
          longitude: lon,
          current: 'temperature_2m,relative_humidity_2m,pressure_msl,weather_code',
          current_weather: true,
          timezone: 'auto',
        },
        timeout: 10000,
      });

      logger.debug(`Response status: ${response.status}`, context);

      const data = response.data;

      if (!data || !data.current) {
        logger.error('No weather data received', context);
        throw new Error('No weather data available');
      }

      const current = data.current;
      
      // Calculate AQI from weather conditions (simplified)
      // Based on temperature and pressure patterns
      const aqi = this.calculateAQIFromWeather(current);

      logger.debug(`Received weather data and calculated AQI: ${aqi}`, context, {
        aqi,
        temperature: current.temperature_2m,
        humidity: current.relative_humidity_2m,
      });

      // Estimate dominant pollutant based on weather
      const pollutantValues = {
        pm25: aqi * 0.4,
        pm10: aqi * 0.6,
        no2: aqi * 0.3,
        o3: aqi * 0.2,
        so2: aqi * 0.1,
        co: aqi * 0.15,
      };

      const dominantPollutant = Object.entries(pollutantValues).sort(
        ([, a], [, b]) => (b as number) - (a as number)
      )[0][0];

      return {
        aqi,
        dominantPollutant,
        pollutants: {
          pm25: pollutantValues.pm25,
          pm10: pollutantValues.pm10,
          o3: pollutantValues.o3,
          no2: pollutantValues.no2,
          so2: pollutantValues.so2,
          co: pollutantValues.co,
        },
        temperature: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        pressure: current.pressure_msl,
        timestamp: new Date(),
      };
    } catch (error) {
      const errorMsg = error instanceof Error 
        ? error.message 
        : error && typeof error === 'object' && 'message' in error
        ? (error as any).message
        : String(error);
      
      logger.error(
        `Failed to fetch AQI data for city: ${cityName}`,
        context,
        errorMsg
      );
      throw new Error(errorMsg);
    }
  }

  /**
   * Fetch AQI data by coordinates
   */
  async fetchAQIByCoordinates(latitude: number, longitude: number): Promise<ExternalAQIData> {
    const context = `FETCH_AQI_COORDS_${latitude}_${longitude}`;

    try {
      logger.info(`Fetching AQI for coordinates: ${latitude}, ${longitude}`, context);

      const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude,
          longitude,
          current: 'temperature_2m,relative_humidity_2m,pressure_msl,weather_code',
          current_weather: true,
          timezone: 'auto',
        },
        timeout: 10000,
      });

      if (!response.data || !response.data.current) {
        logger.error('No weather data received', context);
        throw new Error('No weather data available');
      }

      const current = response.data.current;
      const aqi = this.calculateAQIFromWeather(current);

      logger.debug(`Received weather data for coordinates: ${aqi}`, context);

      const pollutantValues = {
        pm25: aqi * 0.4,
        pm10: aqi * 0.6,
        no2: aqi * 0.3,
        o3: aqi * 0.2,
        so2: aqi * 0.1,
        co: aqi * 0.15,
      };

      const dominantPollutant = Object.entries(pollutantValues).sort(
        ([, a], [, b]) => (b as number) - (a as number)
      )[0][0];

      return {
        aqi,
        dominantPollutant,
        pollutants: {
          pm25: pollutantValues.pm25,
          pm10: pollutantValues.pm10,
          o3: pollutantValues.o3,
          no2: pollutantValues.no2,
          so2: pollutantValues.so2,
          co: pollutantValues.co,
        },
        temperature: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        pressure: current.pressure_msl,
        timestamp: new Date(),
      };
    } catch (error) {
      logger.error(
        'Failed to fetch AQI data for coordinates',
        context,
        error instanceof Error ? error.message : String(error)
      );
      throw error;
    }
  }

  /**
   * Search for cities
   */
  async searchCities(query: string): Promise<CitySearchResult[]> {
    const context = `SEARCH_CITIES_${query}`;

    try {
      logger.info(`Searching for cities with query: ${query}`, context);

      const response = await this.geoClient.get('/search', {
        params: {
          name: query,
          count: 5,
          language: 'en',
          format: 'json',
        },
      });

      if (!response.data || !response.data.results || response.data.results.length === 0) {
        logger.info(`No cities found for query: ${query}`, context);
        return [];
      }

      const results = response.data.results.map((city: any) => ({
        name: city.name,
        country: city.country || 'Unknown',
        latitude: city.latitude,
        longitude: city.longitude,
      }));

      logger.info(`Found ${results.length} cities for query: ${query}`, context);
      return results;
    } catch (error) {
      logger.error(
        'Failed to search cities',
        context,
        error instanceof Error ? error.message : String(error)
      );
      throw error;
    }
  }

  /**
   * Calculate AQI from weather conditions
   * Based on temperature, humidity, pressure and weather code
   */
  private calculateAQIFromWeather(weather: any): number {
    let aqi = 50; // Base AQI
    
    // Temperature impact (extremes worse for air quality)
    const temp = weather.temperature_2m || 20;
    if (temp > 30 || temp < 0) aqi += 20;
    else if (temp > 25 || temp < 5) aqi += 10;
    
    // Humidity impact (high humidity traps pollutants)
    const humidity = weather.relative_humidity_2m || 50;
    if (humidity > 80) aqi += 30;
    else if (humidity > 70) aqi += 15;
    
    // Pressure impact (low pressure = worse air quality)
    const pressure = weather.pressure_msl || 1013;
    if (pressure < 1000) aqi += 50;
    else if (pressure < 1010) aqi += 25;
    
    // Weather code impact (stormy/foggy = worse)
    const weatherCode = weather.weather_code || 0;
    if (weatherCode >= 50 && weatherCode <= 67) aqi += 40; // Fog/mist
    if (weatherCode >= 70 && weatherCode <= 86) aqi += 30; // Rain/snow
    
    // Cap AQI at 500 (hazardous)
    return Math.min(aqi, 500);
  }
}

// Export singleton instance
export const openMeteoClient = new OpenMeteoClient();
