import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize'

export class Permission extends Model<InferAttributes<Permission>, InferCreationAttributes<Permission>> {
  declare id?: number
  declare resource: string
  declare action: string
  declare attributes: string

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
