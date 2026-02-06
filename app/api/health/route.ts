/**
 * Health Interpretation API Route
 * POST /api/health
 * Body: { aqi: number, temperature?: number }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAQICategory } from '@/lib/aqi-utils';
import {
  getCompleteHealthInterpretation,
  getPreventiveActions,
} from '@/lib/health-utils';
import { APIResponse, HealthInterpretationResponse } from '@/types/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { aqi, temperature } = body;

    // Validate AQI
    if (typeof aqi !== 'number' || aqi < 0 || aqi > 500) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Invalid AQI value. Must be between 0 and 500.',
            code: 'INVALID_AQI',
          },
          timestamp: new Date(),
        } as APIResponse,
        { status: 400 }
      );
    }

    // Get category and health interpretation
    const category = getAQICategory(aqi);
    const healthInfo = getCompleteHealthInterpretation(aqi, category.category);
    const preventiveActions = getPreventiveActions(category.category, temperature);

    const response: HealthInterpretationResponse = {
      healthImpact: healthInfo.impact,
      recommendation: healthInfo.recommendation,
      sensitiveGroups: healthInfo.sensitiveGroups,
      preventiveActions,
      activities: healthInfo.activities,
    };

    return NextResponse.json(
      {
        success: true,
        data: response,
        timestamp: new Date(),
      } as APIResponse<HealthInterpretationResponse>,
      { status: 200 }
    );
  } catch (error) {
    console.error('Health API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to generate health interpretation',
          code: 'INTERNAL_ERROR',
        },
        timestamp: new Date(),
      } as APIResponse,
      { status: 500 }
    );
  }
}
