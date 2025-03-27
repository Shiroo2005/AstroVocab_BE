import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize'

export class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
  declare id?: number
  declare name: string
  declare description?: string
  declare isDeleted?: boolean
  static initModel(sequelize: Sequelize) {
    Role.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            is: {
              args: /^(?=.*[a-zA-Z])[a-zA-Z0-9 ]{6,}$/,
              msg: 'Name must contain at least 6 chars, 1 letter and only letter, number'
            },
            notNull: {
              msg: 'Name not be null!'
            }
          }
        },
        description: {
          type: DataTypes.STRING,
          defaultValue: 'N/A'
        },
        isDeleted: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        }
      },
      {
        sequelize,
        modelName: 'Role',
        tableName: 'Roles'
      }
    )
  }
}
