import { checkSchema } from 'express-validator'
import { isEmail, isLength, isPassword, isRequired, isUsername } from '../common.middlewares'
import { BadRequestError } from '~/core/error.response'
import { validateSchema } from '~/utils/validate'
import { userRepository } from '~/repositories/user.repository'
import { roleService } from '~/services/role.service'

// Validate create user
export const createUserValidation = validateSchema(
  checkSchema(
    {
      username: {
        trim: true,
        ...isRequired('Username'),
        ...isUsername,
        ...isLength({ fieldName: 'username' })
      },
      email: {
        trim: true,
        ...isRequired('Email'),
        ...isEmail,
        custom: {
          options: async (value, { req }) => {
            const foundUser = await userRepository.findOne({
              where: [{ email: value }, { username: req.body.username }]
            })

            if (foundUser) {
              throw new BadRequestError('Email or username already taken!')
            }

            return true
          }
        }
      },
      password: {
        trim: true,
        ...isPassword
      },
      fullName: {
        trim: true,
        ...isRequired('fullName'),
        ...isLength({ fieldName: 'fullName' })
      },
      roleId: {
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
      }
    },
    ['body']
  )
)
