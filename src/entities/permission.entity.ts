import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize'
import { Action, Possession, Resource } from '~/constants/access'

export class Permission extends Model<InferAttributes<Permission>, InferCreationAttributes<Permission>> {
  declare id?: number
  declare resource: Resource
  declare action: Action
  declare attributes: string
  declare possession: Possession // any, own,

  static initModel(sequelize: Sequelize) {
    Permission.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        resource: {
          type: DataTypes.STRING,
          validate: {
            len: [2, 50]
          }
        },
        action: {
          type: DataTypes.STRING,
          validate: {
            len: [2, 50]
          }
        },
        attributes: {
          type: DataTypes.STRING,
          validate: {
            len: [2, 50]
          }
        },
        possession: {
          type: DataTypes.STRING,
          validate: {
            len: [2, 50]
          }
        }
      },
      {
        sequelize,
        modelName: 'Permission',
        tableName: 'Permissions'
      }
    )
  }
}
