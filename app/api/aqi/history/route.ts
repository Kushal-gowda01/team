/**
 * Historical AQI API Route
 * GET /api/aqi/history?city={cityName}&hours={hours}
 */

import { NextRequest, NextResponse } from 'next/server';
import { getHistoricalAQI } from '@/services/aqi-service';
import { APIResponse, HistoricalAQIResponse } from '@/types/api';

// Mark route as dynamic - do not cache
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');
    const hoursParam = searchParams.get('hours');

    if (!city) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Missing required parameter: city',
            code: 'MISSING_PARAMS',
          },
          timestamp: new Date(),
        } as APIResponse,
        { status: 400 }
      );
    }

    const hours = hoursParam ? parseInt(hoursParam, 10) : 24;

    if (isNaN(hours) || hours < 1 || hours > 720) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Invalid hours parameter. Must be between 1 and 720.',
            code: 'INVALID_PARAMS',
          },
          timestamp: new Date(),
        } as APIResponse,
        { status: 400 }
      );
    }

    const historicalData = await getHistoricalAQI(city, hours);

    if (historicalData.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'No historical data available for this city',
            code: 'NO_DATA',
          },
          timestamp: new Date(),
        } as APIResponse,
        { status: 404 }
      );
    }

    // Calculate summary statistics
    const aqiValues = historicalData.map((d) => d.aqi);
    const average = aqiValues.reduce((sum, val) => sum + val, 0) / aqiValues.length;
    const min = Math.min(...aqiValues);
    const max = Math.max(...aqiValues);

    // Determine trend (simple: compare first half vs second half)
    const midpoint = Math.floor(aqiValues.length / 2);
    const firstHalfAvg = aqiValues.slice(0, midpoint).reduce((sum, val) => sum + val, 0) / midpoint;
    const secondHalfAvg = aqiValues.slice(midpoint).reduce((sum, val) => sum + val, 0) / (aqiValues.length - midpoint);
    
    let trend: 'improving' | 'worsening' | 'stable' = 'stable';
    const difference = secondHalfAvg - firstHalfAvg;
    
    if (difference < -5) {
      trend = 'improving';
    } else if (difference > 5) {
      trend = 'worsening';
    }

    const now = new Date();
    const response: HistoricalAQIResponse = {
      cityName: city,
      period: {
        start: new Date(now.getTime() - hours * 60 * 60 * 1000),
        end: now,
        hours,
      },
      data: historicalData,
      summary: {
        average: Math.round(average),
        min,
        max,
        trend,
      },
    };

    return NextResponse.json(
      {
        success: true,
        data: response,
        timestamp: new Date(),
      } as APIResponse<HistoricalAQIResponse>,
      { status: 200 }
    );
  } catch (error) {
    console.error('Historical AQI API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to fetch historical AQI data',
          code: 'INTERNAL_ERROR',
        },
        timestamp: new Date(),
      } as APIResponse,
      { status: 500 }
    );
  }
}
