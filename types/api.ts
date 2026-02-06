/**
 * API Response Type Definitions
 */

import { AQICategory, PollutantData, HistoricalAQIPoint } from './aqi';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
  timestamp: Date;
}

export interface AQIResponse {
  aqi: number;
  category: string;
  categoryCode: AQICategory;
  color: string;
  dominantPollutant: string;
  pollutants: PollutantData;
  temperature?: number;
  humidity?: number;
  healthImpact: string;
  recommendation: string;
  sensitiveGroups: string[];
  activities: {
    outdoor: 'safe' | 'limited' | 'avoid';
    indoor: 'normal' | 'filtered' | 'closed';
    exercise: 'safe' | 'limited' | 'avoid';
  };
  preventiveActions: string[];
  timestamp: Date;
  cityName?: string;
}

export interface HistoricalAQIResponse {
  cityName: string;
  period: {
    start: Date;
    end: Date;
    hours: number;
  };
  data: HistoricalAQIPoint[];
  summary: {
    average: number;
    min: number;
    max: number;
    trend: 'improving' | 'worsening' | 'stable';
  };
}

export interface CitySearchResponse {
  query: string;
  results: Array<{
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  }>;
}

export interface HealthInterpretationRequest {
  aqi: number;
  temperature?: number;
}

export interface HealthInterpretationResponse {
  healthImpact: string;
  recommendation: string;
  sensitiveGroups: string[];
  preventiveActions: string[];
  activities: {
    outdoor: 'safe' | 'limited' | 'avoid';
    indoor: 'normal' | 'filtered' | 'closed';
    exercise: 'safe' | 'limited' | 'avoid';
  };
}
