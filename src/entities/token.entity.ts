import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize'
import { User } from './user.entity'

export class Token extends Model<InferAttributes<Token>, InferCreationAttributes<Token>> {
  declare id?: number
  declare userId: number
  declare refreshToken: string
  static initModel(sequelize: Sequelize) {
    Token.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        userId: {
          type: DataTypes.INTEGER,
          references: {
            model: User,
            key: 'id'
          },
          allowNull: false
        },
        refreshToken: {
          type: DataTypes.STRING,
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: 'Token',
        tableName: 'Tokens',
        indexes: [{ fields: ['refreshToken'], unique: true }]
      }
    )
  }
}
