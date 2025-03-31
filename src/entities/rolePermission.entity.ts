// import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize'
// import { Role } from './role.entity'
// import { Permission } from './permission.entity'

// export class RolePermission extends Model<InferAttributes<RolePermission>, InferCreationAttributes<RolePermission>> {
//   declare id?: number
//   declare roleId: number
//   declare permissionId: number
//   static initModel(sequelize: Sequelize) {
//     RolePermission.init(
//       {
//         id: {
//           type: DataTypes.INTEGER,
//           autoIncrement: true,
//           primaryKey: true
//         },
//         roleId: {
//           type: DataTypes.INTEGER,
//           references: {
//             model: Role,
//             key: 'id'
//           },
//           allowNull: false
//         },
//         permissionId: {
//           type: DataTypes.INTEGER,
//           references: {
//             model: Permission,
//             key: 'id'
//           },
//           allowNull: false
//         }
//       },
//       {
//         sequelize,
//         modelName: 'RolePermission',
//         tableName: 'RolePermissions'
//       }
//     )
//   }
// }
