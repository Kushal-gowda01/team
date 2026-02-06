/**
 * Cache Service
 * Manages caching operations and cache invalidation
 */

import { getCachedData, setCachedData, deleteCachedData, clearCachePattern } from '@/lib/redis';

export class CacheService {
  /**
   * Generate cache key for AQI data
   */
  static getAQICacheKey(identifier: string, type: 'city' | 'coords' = 'city'): string {
    return `aqi:${type}:${identifier.toLowerCase()}`;
  }

  /**
   * Get cached AQI data
   */
  static async getAQICache<T>(identifier: string, type: 'city' | 'coords' = 'city'): Promise<T | null> {
    const key = this.getAQICacheKey(identifier, type);
    return getCachedData<T>(key);
  }

  /**
   * Set AQI cache
   */
  static async setAQICache<T>(
    identifier: string,
    data: T,
    type: 'city' | 'coords' = 'city',
    ttl?: number
  ): Promise<boolean> {
    const key = this.getAQICacheKey(identifier, type);
    return setCachedData(key, data, ttl);
  }

  /**
   * Invalidate cache for specific city
   */
  static async invalidateCityCache(cityName: string): Promise<boolean> {
    const key = this.getAQICacheKey(cityName, 'city');
    return deleteCachedData(key);
  }

  /**
   * Clear all AQI cache
   */
  static async clearAllAQICache(): Promise<number> {
    return clearCachePattern('aqi:*');
  }

  /**
   * Clear old cache entries (older than specified hours)
   */
  static async clearOldCache(hours: number = 24): Promise<void> {
    // This would require storing timestamps in cache metadata
    // For now, we rely on TTL expiration
    console.log(`Cache entries older than ${hours} hours will expire naturally via TTL`);
  }
}
