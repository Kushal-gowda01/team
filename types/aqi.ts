/**
 * AQI Type Definitions
 */

export type AQICategory = 
  | 'good' 
  | 'moderate' 
  | 'unhealthy_sensitive' 
  | 'unhealthy' 
  | 'very_unhealthy' 
  | 'hazardous';

export interface AQIData {
  aqi: number;
  category: string;
  categoryCode: AQICategory;
  color: string;
  dominantPollutant: string;
  timestamp: Date;
}

export interface PollutantData {
  pm25?: number;
  pm10?: number;
  o3?: number;
  no2?: number;
  so2?: number;
  co?: number;
}

export interface EnvironmentalData {
  temperature?: number;
  humidity?: number;
  pressure?: number;
  windSpeed?: number;
}

export interface HealthInfo {
  impact: string;
  recommendation: string;
  sensitiveGroups: string[];
  activities: {
    outdoor: 'safe' | 'limited' | 'avoid';
    indoor: 'normal' | 'filtered' | 'closed';
    exercise: 'safe' | 'limited' | 'avoid';
  };
}

export interface CityInfo {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface HistoricalAQIPoint {
  timestamp: Date;
  aqi: number;
  category: string;
}
