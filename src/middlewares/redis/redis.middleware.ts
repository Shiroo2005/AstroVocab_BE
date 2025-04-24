import { DEFAULT_TTL } from '~/constants/redis'
import redisClient from '~/services/redis.service'

export async function getCache<T = any>(key: string): Promise<T | null> {
  const cached = await redisClient.get(key)
  return cached ? JSON.parse(cached) : null
}

export async function setCache<T = any>(key: string, value: T, ttlSeconds = 60): Promise<void> {
  await redisClient.setEx(key, ttlSeconds, JSON.stringify(value))
}

/**
 * Get from cache, or set it if not found
 */
export async function getOrSetCache<T = any>(
  key: string,
  fetchFn: () => Promise<any>,
  ttlSeconds?: number
): Promise<any> {
  if (!ttlSeconds) ttlSeconds = DEFAULT_TTL

  const cached = await getCache<T>(key)
  if (cached) return cached

  const freshData = await fetchFn()
  await setCache(key, freshData, ttlSeconds)
  return freshData
}
