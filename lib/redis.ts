import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType | null = null;

export async function getRedisClient(): Promise<RedisClientType> {
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  
  redisClient = createClient({
    url: redisUrl,
    password: process.env.REDIS_PASSWORD,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 10) {
          console.error('Redis connection failed after 10 retries');
          return new Error('Redis connection failed');
        }
        return retries * 100; // Exponential backoff
      },
    },
  });

  redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  redisClient.on('connect', () => {
    console.log('Redis Client Connected');
  });

  await redisClient.connect();

  return redisClient;
}

export async function closeRedisClient(): Promise<void> {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
    redisClient = null;
  }
}

// Cache utility functions
export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const client = await getRedisClient();
    const data = await client.get(key);
    
    if (!data) {
      return null;
    }

    return JSON.parse(data) as T;
  } catch (error) {
    console.error('Redis GET error:', error);
    return null;
  }
}

export async function setCachedData<T>(
  key: string,
  data: T,
  ttl: number = 3600
): Promise<boolean> {
  try {
    const client = await getRedisClient();
    await client.setEx(key, ttl, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Redis SET error:', error);
    return false;
  }
}

export async function deleteCachedData(key: string): Promise<boolean> {
  try {
    const client = await getRedisClient();
    await client.del(key);
    return true;
  } catch (error) {
    console.error('Redis DEL error:', error);
    return false;
  }
}

export async function clearCachePattern(pattern: string): Promise<number> {
  try {
    const client = await getRedisClient();
    const keys = await client.keys(pattern);
    
    if (keys.length === 0) {
      return 0;
    }

    await client.del(keys);
    return keys.length;
  } catch (error) {
    console.error('Redis CLEAR error:', error);
    return 0;
  }
}
