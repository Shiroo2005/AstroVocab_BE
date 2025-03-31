import { DataSource, ObjectLiteral, Repository } from 'typeorm'
import { config } from 'dotenv'
import { env } from 'process'
import { parseInt } from 'lodash'
import { LogCustomize } from '~/utils/log'
import { seedData } from '~/core/seeds'

config()

class DatabaseService {
  public appDataSource
  constructor() {
    this.appDataSource = new DataSource({
      type: 'mysql',
      database: env.DB_NAME as string,
      username: env.DB_USERNAME as string,
      password: env.DB_PASSWORD as string,
      host: env.DB_HOST as string,
      port: parseInt(env.DB_PORT as string),
      entities: ['src/entities/*.ts'],
      logging: ['query', 'error'],
      synchronize: true
      // logger: LogCustomize
    })
  }

  async connect() {
    try {
      LogCustomize.logSuccess('Database connected successfully ✅')
    } catch (error) {
      LogCustomize.logError(`Unable to connect to the database: ${(error as Error).message}`)
    }
  }

  getRepository<T extends ObjectLiteral>(entity: { new (): T }): Repository<T> {
    return this.appDataSource.getRepository(entity)
  }

  async syncDB() {
    try {
      LogCustomize.logSuccess('Database synchronized (alter mode) 🔄')

      // seed data
      seedData()
    } catch (error) {
      console.log((error as Error).message)
    }
  }

  async init() {
    await this.connect()
    await this.syncDB()
  }
}

export const databaseService = new DatabaseService()
