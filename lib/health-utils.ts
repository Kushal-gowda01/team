/**
 * Health Interpretation Utilities
 * Translates AQI values into health impacts and recommendations
 */

import { AQICategory } from './aqi-utils';

export interface HealthInterpretation {
  impact: string;
  recommendation: string;
  sensitiveGroups: string[];
  activities: {
    outdoor: 'safe' | 'limited' | 'avoid';
    indoor: 'normal' | 'filtered' | 'closed';
    exercise: 'safe' | 'limited' | 'avoid';
  };
}

/**
 * Generate health impact message based on AQI
 */
export function getHealthImpact(aqi: number, category: AQICategory): string {
  const impacts: Record<AQICategory, string> = {
    good: 'Air quality is considered satisfactory, and air pollution poses little or no risk.',
    moderate: 'Air quality is acceptable for most people. However, sensitive individuals may experience minor respiratory symptoms.',
    unhealthy_sensitive: 'Sensitive groups (children, elderly, people with respiratory conditions) may experience health effects.',
    unhealthy: 'Everyone may begin to experience health effects. Sensitive groups may experience more serious effects.',
    very_unhealthy: 'Health alert: Everyone may experience more serious health effects.',
    hazardous: 'Health warnings of emergency conditions. The entire population is likely to be affected.',
  };

  return impacts[category];
}

/**
 * Generate actionable recommendations based on AQI
 */
export function getRecommendation(aqi: number, category: AQICategory): string {
  const recommendations: Record<AQICategory, string> = {
    good: 'Perfect day for outdoor activities. Enjoy your time outside!',
    moderate: 'Most people can enjoy outdoor activities. Unusually sensitive individuals should consider limiting prolonged outdoor exertion.',
    unhealthy_sensitive: 'Sensitive groups should limit prolonged outdoor exertion. Keep windows closed if possible.',
    unhealthy: 'Everyone should limit prolonged outdoor exertion. Keep windows closed. Consider wearing a mask if you must go outside.',
    very_unhealthy: 'Avoid all outdoor activities. Stay indoors with windows closed. Use air purifiers if available.',
    hazardous: 'Emergency conditions. Stay indoors and keep activity levels low. Seal windows and doors. Use air purifiers.',
  };

  return recommendations[category];
}

/**
 * Get sensitive groups affected by current AQI
 */
export function getSensitiveGroups(category: AQICategory): string[] {
  const groups: Record<AQICategory, string[]> = {
    good: [],
    moderate: ['Unusually sensitive individuals'],
    unhealthy_sensitive: ['Children', 'Elderly', 'People with asthma', 'People with heart disease'],
    unhealthy: ['Children', 'Elderly', 'People with respiratory conditions', 'People with heart disease', 'Active individuals'],
    very_unhealthy: ['Everyone', 'Especially children and elderly'],
    hazardous: ['Entire population'],
  };

  return groups[category];
}

/**
 * Get activity recommendations
 */
export function getActivityRecommendations(
  category: AQICategory
): HealthInterpretation['activities'] {
  const activities: Record<AQICategory, HealthInterpretation['activities']> = {
    good: { outdoor: 'safe', indoor: 'normal', exercise: 'safe' },
    moderate: { outdoor: 'safe', indoor: 'normal', exercise: 'safe' },
    unhealthy_sensitive: { outdoor: 'limited', indoor: 'normal', exercise: 'limited' },
    unhealthy: { outdoor: 'limited', indoor: 'filtered', exercise: 'limited' },
    very_unhealthy: { outdoor: 'avoid', indoor: 'closed', exercise: 'avoid' },
    hazardous: { outdoor: 'avoid', indoor: 'closed', exercise: 'avoid' },
  };

  return activities[category];
}

/**
 * Get complete health interpretation
 */
export function getCompleteHealthInterpretation(
  aqi: number,
  category: AQICategory
): HealthInterpretation {
  return {
    impact: getHealthImpact(aqi, category),
    recommendation: getRecommendation(aqi, category),
    sensitiveGroups: getSensitiveGroups(category),
    activities: getActivityRecommendations(category),
  };
}

/**
 * Get temperature-adjusted recommendations
 */
export function getTemperatureAdjustedRecommendation(
  baseRecommendation: string,
  temperature: number
): string {
  let adjustment = '';

  if (temperature > 35) {
    adjustment = ' Stay hydrated and avoid heat exposure.';
  } else if (temperature > 30) {
    adjustment = ' Drink plenty of water and seek shade when outdoors.';
  } else if (temperature < 0) {
    adjustment = ' Dress warmly and limit time in cold air.';
  } else if (temperature < 10) {
    adjustment = ' Wear appropriate clothing for cold weather.';
  }

  return baseRecommendation + adjustment;
}

/**
 * Generate preventive actions list
 */
export function getPreventiveActions(category: AQICategory, temperature?: number): string[] {
  const baseActions: Record<AQICategory, string[]> = {
    good: ['Enjoy outdoor activities', 'Keep windows open for fresh air'],
    moderate: [
      'Outdoor activities are generally safe',
      'Sensitive individuals should monitor symptoms',
    ],
    unhealthy_sensitive: [
      'Sensitive groups should limit outdoor exposure',
      'Close windows during peak pollution hours',
      'Reduce physical exertion outdoors',
    ],
    unhealthy: [
      'Limit time outdoors',
      'Wear a mask when outside',
      'Keep windows and doors closed',
      'Use air purifiers indoors',
      'Avoid strenuous outdoor activities',
    ],
    very_unhealthy: [
      'Avoid all outdoor activities',
      'Stay indoors with windows closed',
      'Use air purifiers',
      'Wear N95 masks if you must go outside',
      'Check on vulnerable family members',
    ],
    hazardous: [
      'Stay indoors at all times',
      'Seal windows and doors',
      'Use HEPA air purifiers',
      'Do not exercise',
      'Seek medical attention if experiencing symptoms',
      'Follow emergency guidelines',
    ],
  };

  const actions = [...baseActions[category]];

  // Add temperature-specific actions
  if (temperature !== undefined) {
    if (temperature > 30) {
      actions.push('Stay hydrated', 'Avoid heat exposure');
    } else if (temperature < 5) {
      actions.push('Dress warmly', 'Limit cold air exposure');
    }
  }

  return actions;
}
