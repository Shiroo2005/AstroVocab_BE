import { createClient } from 'redis'

const redisClient = createClient({
  url: process.env.REDIS_URL
})

export const redisConnect = () => {
  redisClient.on('error', (err) => console.error('Redis error:', err))

  redisClient.connect().then(() => console.log(`Redis connect successful with url = ${process.env.REDIS_URL}`))
}
export default redisClient
