import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validate'
import { isLength, isRequired, isString } from '../common.middlewares'
import { findOneRole } from '~/repositories/role.repository'
import { BadRequestError } from '~/core/error.response'

export const createPermissionValidation = validate(
  checkSchema({
    roleId: {
      ...isRequired('roleId'),
      isNumeric: true,
      custom: {
        options: async (values, { req }) => {
          const foundRole = await findOneRole({
            condition: {
              id: values as number
            }
          })

          if (!foundRole) throw new BadRequestError('Role id invalid!')
        }
      }
    },
    permissions: {
      ...isRequired('permissions')
    },
    'permissions.*.resource': {
      ...isString('permissions.*.resource'),
      ...isLength({ fieldName: 'permission.*.resource', min: 2, max: 50 })
    },
    'permissions.*.action': {
      ...isString('permissions.*.action'),
      ...isLength({ fieldName: 'permission.*.action', min: 2, max: 50 })
    },
    'permissions.*.attributes': {
      ...isString('permissions.*.attributes'),
      ...isLength({ fieldName: 'permission.*.attribute', min: 2, max: 50 })
    }
  })
)
