import { Sequelize, Dialect } from 'sequelize'
import { config } from 'dotenv'
import { env } from 'process'
import { parseInt } from 'lodash'
import { LogCustomize } from '~/utils/log'
import { User } from '~/entities/user.entity'
import { Token } from '~/entities/token.entity'
import { Role } from '~/entities/role.entity'
import { seedData } from '~/core/seeds'
import { Permission } from '~/entities/permission.entity'
import { RolePermission } from '~/entities/rolePermission.entity'

config()

const options = {
  dialect: 'mysql' as Dialect,
  database: env.DB_NAME,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: parseInt(env.DB_PORT as string),
  logging: LogCustomize.logDB
}

class DatabaseService {
  public sequelize: Sequelize
  constructor() {
    this.sequelize = new Sequelize(options)
  }

  async connect() {
    try {
      await this.sequelize.authenticate()
      LogCustomize.logSuccess('Database connected successfully ✅')
    } catch (error) {
      LogCustomize.logError(`Unable to connect to the database: ${(error as Error).message}`)
    }
  }

  async createRelationShip() {
    // USER 1-N TOKEN
    User.hasMany(Token, { foreignKey: 'userId', as: 'Tokens' })
    Token.belongsTo(User, { foreignKey: 'userId', as: 'User' })

    // USER N-1 Role
    User.belongsTo(Role, { foreignKey: 'roleId', as: 'Role' })
    Role.hasMany(User, { foreignKey: 'roleId', as: 'Users' })
  }

  async syncDB() {
    try {
      // init role
      Role.initModel(this.sequelize)

      // init user
      User.initModel(this.sequelize)

      // init token
      Token.initModel(this.sequelize)

      // init permission
      Permission.initModel(this.sequelize)

      // init Role_Permission
      RolePermission.initModel(this.sequelize)

      this.createRelationShip()
      // update column

      await this.sequelize.sync({ alter: true })
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
