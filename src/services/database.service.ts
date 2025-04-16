import { config } from 'dotenv'
import * as mysql2 from 'mysql2'
import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm'
import { customLogger } from '~/utils/log'
import { seedData } from '~/core/seeds'

config()

// ⚙️ Khởi tạo AppDataSource
export const AppDataSource = new DataSource({
  type: 'mysql',
  driver: mysql2,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../entities/**/*.entity.{ts,js}'],
  logging: false,
  logger: customLogger
})

// 🚀 Kết nối DB (nên gọi 1 lần ở main.ts)
export async function connectDatabase() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize()
    customLogger.log('info', '✅ Database connected successfully')
  }
}

// 🔄 Đồng bộ DB + seed data (optional)
export async function syncDatabase() {
  await connectDatabase()
  await AppDataSource.synchronize()
  customLogger.log('info', '📦 Database synchronized')
}

export function getRepository<T extends ObjectLiteral>(entity: EntityTarget<T>): Repository<T> {
  return AppDataSource.getRepository(entity)
}
