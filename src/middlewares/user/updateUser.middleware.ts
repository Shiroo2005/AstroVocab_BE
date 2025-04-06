import { checkSchema } from 'express-validator'
import { isEmail, isLength, isPassword, isRequired, isUsername } from '../common.middlewares'
import { BadRequestError } from '~/core/error.response'
import { validateSchema } from '~/utils/validate'
import { userRepository } from '~/repositories/user.repository'
import { roleService } from '~/services/role.service'
import { objectToArray } from '~/utils'
import { UserStatus } from '~/constants/userStatus'
import { User } from '~/entities/user.entity'
import { Request } from 'express'

// Validate update user
export const updateUserValidation = validateSchema(
  checkSchema(
    {
      username: {
        trim: true,
        optional: true,
        ...isUsername,
        ...isLength({ fieldName: 'username' })
      },
      email: {
        trim: true,
        optional: true,
        ...isRequired('Email'),
        ...isEmail,
        custom: {
          options: async (value, { req }) => {
            const result = (await userRepository.findAll({
              where: [{ email: value }, { username: req.body.username }]
            })) as { foundUser: User[]; total: number } | null
            if (result && result.foundUser) {
              const foundUser = result.foundUser
              const userId = (req as Request).idParams as number
              foundUser.forEach((user) => {
                if (user.id != userId) {
                  throw new BadRequestError('Email or username already taken!')
                }
              })
            }

            return true
          }
        }
      },
      fullName: {
        trim: true,
        optional: true,
        ...isRequired('fullName'),
        ...isLength({ fieldName: 'fullName' })
      },
      roleId: {
        optional: true,
        ...isRequired('roleId'),
        isDecimal: true,
        custom: {
          options: async (value) => {
            const foundRole = await roleService.isExistRoleId(value)
            if (!foundRole) {
              throw new BadRequestError('Role id invalid!')
            }
            return true
          }
        }
      },
      status: {
        optional: true,
        isIn: {
          options: [objectToArray(UserStatus)],
          errorMessage: 'User status invalid!'
        }
      }
    },
    ['body']
  )
)
