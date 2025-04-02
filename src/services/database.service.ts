import { config } from 'dotenv'
import { env } from 'process'
import { parseInt } from 'lodash'
import * as mysql2 from 'mysql2'
import { LogCustomize } from '~/utils/log'
import { DataSource, ObjectLiteral, Repository } from 'typeorm'
import { Permission } from '~/entities/permission.entity'
import { User } from '~/entities/user.entity'
import { Role } from '~/entities/role.entity'
import { Token } from '~/entities/token.entity'
import { seedData } from '~/core/seeds'
console.log('DatabaseService loaded')

config()

export class DatabaseService {
  public appDataSource
  private static instance: DatabaseService
  constructor() {
    console.log('DatabaseService loaded')
    this.appDataSource = new DataSource({
      type: 'mysql',
      driver: mysql2,
      database: env.DB_NAME as string,
      username: env.DB_USERNAME as string,
      password: env.DB_PASSWORD as string,
      host: env.DB_HOST as string,
      port: parseInt(env.DB_PORT as string),
      entities: [Token, User, Role, Permission],
      logging: ['query', 'error']
      // synchronize: true
      // logger: LogCustomize
    })
  }

  async connect() {
    try {
      await this.appDataSource.initialize()
      LogCustomize.logSuccess('Database connected successfully ✅')
    } catch (error) {
      LogCustomize.logError(`Unable to connect to the database: ${(error as Error).message}`)
    }
  }

  async getRepository<T extends ObjectLiteral>(entity: { new (): T }): Promise<Repository<T>> {
    if (!this.appDataSource.isInitialized) await this.connect()
    return this.appDataSource.getRepository(entity)
  }

  async syncDB() {
    try {
      await this.appDataSource.synchronize()
      LogCustomize.logSuccess('Database synchronized (alter mode) 🔄')

      // seed data
      seedData()
    } catch (error) {
      console.log((error as Error).message, (error as Error).stack)
    }
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  async init() {
    await this.connect()
    await this.syncDB()
  }
}
