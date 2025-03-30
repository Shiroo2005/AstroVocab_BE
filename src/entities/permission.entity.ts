import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize'
import { Action, Resource } from '~/constants/access'
import { getResourceValues } from '~/utils'

export class Permission extends Model<InferAttributes<Permission>, InferCreationAttributes<Permission>> {
  declare id?: number
  declare resource: Resource
  declare action: Action

  static initModel(sequelize: Sequelize) {
    Permission.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        resource: {
          type: DataTypes.ENUM(...getResourceValues(Resource)),
          validate: {
            len: [2, 50]
          }
        },
        action: {
          type: DataTypes.ENUM(...getResourceValues(Action)),
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
