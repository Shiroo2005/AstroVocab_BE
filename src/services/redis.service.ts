import { createClient } from 'redis'

const redisClient = createClient({
  url: process.env.REDIS_URL
})

export const redisConnect = async () => {
  redisClient.on('error', (err) => console.error('Redis error:', err))

  await redisClient.connect()
  console.log(`✅ Redis connected: ${process.env.REDIS_URL}`)
}

export default redisClient
