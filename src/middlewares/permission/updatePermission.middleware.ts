import { checkSchema } from 'express-validator'
import { validateSchema } from '~/utils/validate'
import { isLength, isString } from '../common.middlewares'
import { BadRequestError } from '~/core/error.response'
import { permissionRepository } from '~/repositories/permission.repository'
import { Permission } from '~/entities/permission.entity'
import { Request } from 'express'

export const updatePermissionValidation = validateSchema(
  checkSchema(
    {
      resource: {
        ...isString('resource'),
        ...isLength({ fieldName: 'resource', min: 2, max: 50 })
      },
      action: {
        ...isString('action'),
        ...isLength({ fieldName: 'action', min: 2, max: 50 }),
        custom: {
          options: async (value, { req }) => {
            const foundPermission = (await permissionRepository.findOne({
              action: (value as Permission).action,
              resource: (value as Permission).resource
            })) as Permission | null

            const id = (req as Request).idParams

            if (foundPermission && foundPermission.id != id)
              throw new BadRequestError('Permission with this action and resource already existing!')
          }
        }
      }
    },
    ['body']
  )
)
