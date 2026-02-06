/**
 * OpenWeatherMap API Client
 * Handles fetching data from OpenWeatherMap Air Pollution API
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

class OpenWeatherAPIClient {
  private client: AxiosInstance;
  private geoClient: AxiosInstance;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY || '';

    this.client = axios.create({
      baseURL: process.env.OPENWEATHER_BASE_URL || 'http://api.openweathermap.org',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.geoClient = axios.create({
      baseURL: process.env.OPENWEATHER_GEO_URL || 'http://api.openweathermap.org/geo/1.0',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!this.apiKey) {
      logger.warn(
        'OPENWEATHER_API_KEY is not set in environment variables',
        'OW_API_CLIENT_INIT'
      );
    } else {
      logger.info('OpenWeather API Client initialized', 'OW_API_CLIENT_INIT', {
        hasApiKey: !!this.apiKey,
      });
    }
  }

  /**
   * Convert AQI index to category
   * OpenWeatherMap uses: 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor
   */
  private getAQICategory(index: number): number {
    // Convert to rough AQI scale (0-500)
    const aqiMap: { [key: number]: number } = {
      1: 25,    // Good
      2: 75,    // Fair
      3: 125,   // Moderate
      4: 175,   // Poor
      5: 250,   // Very Poor (not hazardous)
    };
    return aqiMap[index] || 0;
  }

  /**
   * Get city coordinates by name
   */
  async getCityCoordinates(cityName: string): Promise<{ lat: number; lon: number }> {
    const context = `GET_COORDS_${cityName}`;

    try {
      logger.info(`Getting coordinates for city: ${cityName}`, context);

      const response = await this.geoClient.get('/direct', {
        params: {
          q: cityName,
          limit: 1,
          appid: this.apiKey,
        },
      });

      if (!response.data || response.data.length === 0) {
        logger.error(`City not found: ${cityName}`, context, 'No results from geocoding');
        throw new Error(`City "${cityName}" not found`);
      }

      const { lat, lon } = response.data[0];
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
   * Fetch AQI data for a city
   */
  async fetchAQIByCity(cityName: string): Promise<ExternalAQIData> {
    const context = `FETCH_AQI_CITY_${cityName}`;

    try {
      logger.info(`Fetching AQI for city: ${cityName}`, context);

      if (!this.apiKey) {
        logger.error(
          'API key is missing',
          context,
          'OPENWEATHER_API_KEY environment variable not set'
        );
        throw new Error('OPENWEATHER_API_KEY is not configured');
      }

      // First, get coordinates for the city
      const { lat, lon } = await this.getCityCoordinates(cityName);

      // Then fetch air pollution data
      const response = await this.client.get('/data/2.5/air_pollution', {
        params: {
          lat,
          lon,
          appid: this.apiKey,
        },
      });

      logger.debug(`Response status: ${response.status}`, context);

      const data = response.data;

      if (!data || !data.list || data.list.length === 0) {
        logger.error('No air pollution data received', context);
        throw new Error('No air pollution data available');
      }

      const pollutionData = data.list[0];
      const aqi = pollutionData.main?.aqi || 1;
      const components = pollutionData.components || {};

      // Convert OpenWeatherMap AQI (1-5) to standard AQI scale
      const aqiValue = this.getAQICategory(aqi);

      logger.debug(`Received AQI data: ${aqiValue}`, context, {
        aqi: aqiValue,
        components,
      });

      // Determine dominant pollutant
      const pollutantValues = {
        pm25: components.pm2_5 || 0,
        pm10: components.pm10 || 0,
        no2: components.no2 || 0,
        o3: components.o3 || 0,
        so2: components.so2 || 0,
        co: components.co || 0,
      };

      const dominantPollutant = Object.entries(pollutantValues).sort(
        ([, a], [, b]) => (b as number) - (a as number)
      )[0][0];

      return {
        aqi: aqiValue,
        dominantPollutant,
        pollutants: {
          pm25: components.pm2_5,
          pm10: components.pm10,
          o3: components.o3,
          no2: components.no2,
          so2: components.so2,
          co: components.co,
        },
        temperature: undefined,
        humidity: undefined,
        pressure: undefined,
        timestamp: new Date(pollutionData.dt ? pollutionData.dt * 1000 : Date.now()),
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

      if (!this.apiKey) {
        logger.error(
          'API key is missing',
          context,
          'OPENWEATHER_API_KEY environment variable not set'
        );
        throw new Error('OPENWEATHER_API_KEY is not configured');
      }

      const response = await this.client.get('/data/2.5/air_pollution', {
        params: {
          lat: latitude,
          lon: longitude,
          appid: this.apiKey,
        },
      });

      if (!response.data || !response.data.list || response.data.list.length === 0) {
        logger.error('No air pollution data received', context);
        throw new Error('No air pollution data available');
      }

      const pollutionData = response.data.list[0];
      const aqi = pollutionData.main?.aqi || 1;
      const components = pollutionData.components || {};

      const aqiValue = this.getAQICategory(aqi);

      logger.debug(`Received AQI data for coordinates: ${aqiValue}`, context);

      const pollutantValues = {
        pm25: components.pm2_5 || 0,
        pm10: components.pm10 || 0,
        no2: components.no2 || 0,
        o3: components.o3 || 0,
        so2: components.so2 || 0,
        co: components.co || 0,
      };

      const dominantPollutant = Object.entries(pollutantValues).sort(
        ([, a], [, b]) => (b as number) - (a as number)
      )[0][0];

      return {
        aqi: aqiValue,
        dominantPollutant,
        pollutants: {
          pm25: components.pm2_5,
          pm10: components.pm10,
          o3: components.o3,
          no2: components.no2,
          so2: components.so2,
          co: components.co,
        },
        temperature: undefined,
        humidity: undefined,
        pressure: undefined,
        timestamp: new Date(pollutionData.dt ? pollutionData.dt * 1000 : Date.now()),
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

      const response = await this.geoClient.get('/direct', {
        params: {
          q: query,
          limit: 5,
          appid: this.apiKey,
        },
      });

      if (!response.data || response.data.length === 0) {
        logger.info(`No cities found for query: ${query}`, context);
        return [];
      }

      const results = response.data.map((city: any) => ({
        name: city.name,
        country: city.country || 'Unknown',
        latitude: city.lat,
        longitude: city.lon,
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
}

// Export singleton instance
export const aqiAPIClient = new OpenWeatherAPIClient();
