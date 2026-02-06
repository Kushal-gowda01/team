/**
 * AQI Service
 * Business logic for AQI data processing
 */

import { aqiAPIClient, ExternalAQIData } from '@/lib/api-client';
import { getAQICategory } from '@/lib/aqi-utils';
import { getCompleteHealthInterpretation, getPreventiveActions } from '@/lib/health-utils';
import { getCachedData, setCachedData } from '@/lib/redis';
import prisma from '@/lib/db';
import { AQIResponse } from '@/types/api';
import { logger } from '@/lib/logger';

const CACHE_TTL = parseInt(process.env.CACHE_DEFAULT_TTL || '3600', 10);
const CACHE_ENABLED = process.env.CACHE_ENABLED !== 'false';

/**
 * Get AQI data for a city with caching
 */
export async function getAQIForCity(cityName: string): Promise<AQIResponse> {
  const context = `AQI_SERVICE_CITY_${cityName}`;
  
  try {
    logger.info(`Starting AQI fetch for city: ${cityName}`, context);
    
    const cacheKey = `aqi:city:${cityName.toLowerCase()}`;

    // Check cache first
    if (CACHE_ENABLED) {
      logger.debug('Checking cache for AQI data', context);
      const cachedData = await getCachedData<AQIResponse>(cacheKey);
      
      if (cachedData) {
        logger.info(`Cache hit for city: ${cityName}`, context);
        return cachedData;
      }
      logger.debug('Cache miss, fetching from API', context);
    }

    // Fetch from external API
    logger.info(`Fetching from external AQI API for: ${cityName}`, context);
    
    if (!process.env.AQI_API_KEY) {
      logger.error(
        'AQI_API_KEY environment variable is not set',
        context,
        'Missing API Key'
      );
      throw new Error('AQI_API_KEY is not configured. Please set the environment variable.');
    }

    const externalData = await aqiAPIClient.fetchAQIByCity(cityName);
    logger.debug(`Received external AQI data: ${externalData.aqi}`, context);

    // Process and enrich data
    const response = await processAQIData(externalData, cityName);
    logger.debug('AQI data processed successfully', context);

    // Store in database
    await storeAQIRecord(cityName, externalData, response);

    // Cache the result
    if (CACHE_ENABLED) {
      await setCachedData(cacheKey, response, CACHE_TTL);
      logger.debug(`AQI data cached for ${CACHE_TTL}s`, context);
    }

    logger.info(`Successfully retrieved AQI data for ${cityName}`, context, {
      aqi: response.aqi,
      category: response.category,
    });

    return response;
  } catch (error) {
    logger.error(
      `Failed to get AQI data for city: ${cityName}`,
      context,
      error instanceof Error ? error : String(error)
    );
    throw error;
  }
}

/**
 * Get AQI data by coordinates with caching
 */
export async function getAQIByCoordinates(
  latitude: number,
  longitude: number
): Promise<AQIResponse> {
  const context = `AQI_SERVICE_COORDS_${latitude},${longitude}`;
  
  try {
    logger.info(`Starting AQI fetch for coordinates: ${latitude}, ${longitude}`, context);
    
    const cacheKey = `aqi:coords:${latitude},${longitude}`;

    // Check cache first
    if (CACHE_ENABLED) {
      const cachedData = await getCachedData<AQIResponse>(cacheKey);
      if (cachedData) {
        logger.info('Cache hit for coordinates', context);
        return cachedData;
      }
    }

    // Fetch from external API
    logger.info('Fetching from external API', context);
    
    if (!process.env.AQI_API_KEY) {
      logger.error(
        'AQI_API_KEY environment variable is not set',
        context,
        'Missing API Key'
      );
      throw new Error('AQI_API_KEY is not configured.');
    }

    const externalData = await aqiAPIClient.fetchAQIByCoordinates(latitude, longitude);

    // Process and enrich data
    const response = await processAQIData(externalData);

    // Cache the result
    if (CACHE_ENABLED) {
      await setCachedData(cacheKey, response, CACHE_TTL);
    }

    logger.info('Successfully retrieved AQI data for coordinates', context, {
      aqi: response.aqi,
      category: response.category,
    });

    return response;
  } catch (error) {
    logger.error(
      'Failed to get AQI data for coordinates',
      context,
      error instanceof Error ? error : String(error)
    );
    throw error;
  }
}

/**
 * Process external AQI data and add health interpretations
 */
async function processAQIData(
  data: ExternalAQIData,
  cityName?: string
): Promise<AQIResponse> {
  const context = 'PROCESS_AQI_DATA';
  
  try {
    logger.debug('Processing AQI data', context, { aqi: data.aqi });
    
    const category = getAQICategory(data.aqi);
    const healthInfo = getCompleteHealthInterpretation(data.aqi, category.category);
    const preventiveActions = getPreventiveActions(category.category, data.temperature);

    const response: AQIResponse = {
      aqi: data.aqi,
      category: category.label,
      categoryCode: category.category,
      color: category.color,
      dominantPollutant: data.dominantPollutant,
      pollutants: data.pollutants,
      temperature: data.temperature,
      humidity: data.humidity,
      healthImpact: healthInfo.impact,
      recommendation: healthInfo.recommendation,
      sensitiveGroups: healthInfo.sensitiveGroups,
      activities: healthInfo.activities,
      preventiveActions,
      timestamp: data.timestamp,
      cityName,
    };

    logger.debug('AQI data processing completed', context);
    return response;
  } catch (error) {
    logger.error(
      'Error processing AQI data',
      context,
      error instanceof Error ? error : String(error)
    );
    throw error;
  }
}

/**
 * Store AQI record in database
 */
async function storeAQIRecord(
  cityName: string,
  externalData: ExternalAQIData,
  processedData: AQIResponse
): Promise<void> {
  const context = `STORE_AQI_RECORD_${cityName}`;
  
  try {
    logger.debug('Storing AQI record in database', context);

    // Find or create city
    const city = await prisma.city.upsert({
      where: {
        name_country: {
          name: cityName,
          country: 'Unknown',
        },
      },
      update: {},
      create: {
        name: cityName,
        country: 'Unknown',
        latitude: 0,
        longitude: 0,
      },
    });

    logger.debug(`City record ready: ${city.id}`, context);

    // Create AQI record
    await prisma.aQIRecord.create({
      data: {
        cityId: city.id,
        aqi: externalData.aqi,
        category: processedData.categoryCode,
        dominantPollutant: externalData.dominantPollutant,
        pm25: externalData.pollutants.pm25,
        pm10: externalData.pollutants.pm10,
        o3: externalData.pollutants.o3,
        no2: externalData.pollutants.no2,
        so2: externalData.pollutants.so2,
        co: externalData.pollutants.co,
        temperature: externalData.temperature,
        humidity: externalData.humidity,
        pressure: externalData.pressure,
        healthImpact: processedData.healthImpact,
        recommendation: processedData.recommendation,
        timestamp: externalData.timestamp,
      },
    });

    logger.info('AQI record stored successfully', context);
  } catch (error) {
    logger.warn(
      'Failed to store AQI record in database',
      context,
      error instanceof Error ? error : String(error)
    );
    // Don't throw - storage failure shouldn't block the response
  }
}

/**
 * Get historical AQI data for a city
 */
export async function getHistoricalAQI(
  cityName: string,
  hours: number = 24
): Promise<Array<{ timestamp: Date; aqi: number; category: string }>> {
  const context = `HISTORICAL_AQI_${cityName}`;
  
  try {
    logger.info(`Fetching historical AQI for ${cityName} (${hours} hours)`, context);
    
    const city = await prisma.city.findFirst({
      where: { name: cityName },
    });

    if (!city) {
      logger.warn(`City not found in database: ${cityName}`, context);
      return [];
    }

    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const records = await prisma.aQIRecord.findMany({
      where: {
        cityId: city.id,
        timestamp: {
          gte: since,
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
      select: {
        timestamp: true,
        aqi: true,
        category: true,
      },
    });

    logger.info(`Retrieved ${records.length} historical records`, context);
    return records;
  } catch (error) {
    logger.error(
      'Failed to fetch historical AQI data',
      context,
      error instanceof Error ? error : String(error)
    );
    return [];
  }
}
