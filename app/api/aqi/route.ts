/**
 * AQI API Route
 * GET /api/aqi?city={cityName}
 * GET /api/aqi?lat={latitude}&lon={longitude}
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAQIForCity, getAQIByCoordinates } from '@/services/aqi-service';
import { APIResponse, AQIResponse } from '@/types/api';
import { logger } from '@/lib/logger';

// Mark route as dynamic - do not cache
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const context = 'AQI_API_ROUTE';
  
  try {
    logger.info('AQI API request received', context);
    
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    logger.debug(`Parameters - city: ${city}, lat: ${lat}, lon: ${lon}`, context, {
      city,
      lat,
      lon,
    });

    let aqiData: AQIResponse;

    // Fetch by city name
    if (city) {
      logger.info(`Fetching AQI data for city: ${city}`, context);
      aqiData = await getAQIForCity(city);
      logger.info(`Successfully fetched AQI data for ${city}`, context, {
        aqi: aqiData.aqi,
        category: aqiData.category,
      });
    }
    // Fetch by coordinates
    else if (lat && lon) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);

      if (isNaN(latitude) || isNaN(longitude)) {
        logger.warn('Invalid coordinates provided', context, { lat, lon });
        return NextResponse.json(
          {
            success: false,
            error: {
              message: 'Invalid coordinates',
              code: 'INVALID_PARAMS',
            },
            timestamp: new Date(),
          } as APIResponse,
          { status: 400 }
        );
      }

      logger.info(`Fetching AQI data for coordinates: ${latitude}, ${longitude}`, context);
      aqiData = await getAQIByCoordinates(latitude, longitude);
      logger.info(`Successfully fetched AQI data for coordinates`, context, {
        aqi: aqiData.aqi,
        category: aqiData.category,
      });
    }
    // Missing parameters
    else {
      logger.warn('Missing required parameters', context);
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Missing required parameters: city or (lat & lon)',
            code: 'MISSING_PARAMS',
          },
          timestamp: new Date(),
        } as APIResponse,
        { status: 400 }
      );
    }

    logger.info('AQI API request completed successfully', context);
    
    return NextResponse.json(
      {
        success: true,
        data: aqiData,
        timestamp: new Date(),
      } as APIResponse<AQIResponse>,
      { status: 200 }
    );
  } catch (error) {
    logger.error(
      'AQI API request failed',
      context,
      error instanceof Error ? error : String(error),
      { error: String(error) }
    );

    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch AQI data',
          code: 'INTERNAL_ERROR',
        },
        timestamp: new Date(),
      } as APIResponse,
      { status: 500 }
    );
  }
}
