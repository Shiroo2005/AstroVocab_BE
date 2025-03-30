import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validate'
import { isLength, isRequired, isString } from '../common.middlewares'
import { BadRequestError } from '~/core/error.response'
import { roleRepository } from '~/repositories/role.repository'
import { permissionRepository } from '~/repositories/permission.repository'
import { Permission } from '~/entities/permission.entity'

// export const createPermissionValidation = validate(
//   checkSchema({
//     roleId: {
//       ...isRequired('roleId'),
//       isNumeric: true,
//       custom: {
//         options: async (values, { req }) => {
//           const foundRole = await roleRepository.findOneRole({
//             condition: {
//               id: values as number
//             }
//           })

//           if (!foundRole) throw new BadRequestError('Role id invalid!')
//         }
//       }
//     },
//     permissions: {
//       ...isRequired('permissions')
//     },
//     'permissions.*.resource': {
//       ...isString('permissions.*.resource'),
//       ...isLength({ fieldName: 'permission.*.resource', min: 2, max: 50 })
//     },
//     'permissions.*.action': {
//       ...isString('permissions.*.action'),
//       ...isLength({ fieldName: 'permission.*.action', min: 2, max: 50 })
//     },
//     'permissions.*.attributes': {
//       ...isString('permissions.*.attributes'),
//       ...isLength({ fieldName: 'permission.*.attribute', min: 2, max: 50 })
//     }
//   })
// )

export const createPermissionValidation = validate(
  checkSchema({
    resource: {
      ...isString('permissions.*.resource'),
      ...isLength({ fieldName: 'permission.*.resource', min: 2, max: 50 })
    },
    action: {
      ...isString('permissions.*.action'),
      ...isLength({ fieldName: 'permission.*.action', min: 2, max: 50 }),
      custom: {
        options: async (value, { req }) => {
          const foundPermission = await permissionRepository.find({
            condition: {
              action: (value as Permission).action,
              resource: (value as Permission).resource
            }
          })

          if (foundPermission) throw new BadRequestError('Permission with this action and resource already existing!')
        }
      }
    }
  })
)
