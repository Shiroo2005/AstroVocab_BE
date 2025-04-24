import { config } from 'dotenv'

export const envConfig = () => {
  const env = process.env.NODE_ENV || 'development'
  config({ path: `.env${env === 'production' ? '.production' : ''}` })

  console.log(`This run in development ${env}!`)
}
