import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize'
import { UserStatus } from '~/constants/userStatus'

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id?: number
  declare email: string
  declare username: string
  declare password: string
  declare fullName: string
  declare avatar?: string
  declare status?: UserStatus

  static initModel(sequelize: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            is: {
              args: /^[\w.-]+@([\w-]+\.)+[\w-]{2,20}$/,
              msg: 'Email invalid format!'
            }
          }
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            len: [5, 20]
          }
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            is: {
              args: /^(?=.*[A-Z]).{6,}$/, // Min: 6 chars, 1 upper_case
              msg: 'Password must be contain at least 6 chars, 1 upperCase!'
            }
          }
        },
        fullName: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            is: {
              args: /^(?=(?:.*\p{L}){3})[\p{L}0-9 \-']+$/u,
              msg: 'Full name must contain at least 3 letters and only letters, number, some symbols!'
            }
          }
        },
        avatar: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: 'N/A'
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: UserStatus.NOT_VERIFIED
        }
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'Users',
        indexes: [
          { fields: ['email'], unique: true },
          { fields: ['username'], unique: true }
        ]
      }
    )
  }
}
