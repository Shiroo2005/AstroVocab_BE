import { checkSchema } from 'express-validator'
import { isEmail, isLength, isPassword, isRequired, isUsername } from '../common.middlewares'
import { findOneUser } from '~/repositories/user.repository'
import { Op } from 'sequelize'
import { BadRequestError } from '~/core/error.response'
import { validate } from '~/utils/validate'

// Validate Register
export const registerValidation = validate(
  checkSchema({
    username: {
      ...isRequired('Username'),
      ...isUsername
    },
    email: {
      ...isRequired('Email'),
      ...isEmail,
      custom: {
        options: async (value, { req }) => {
          const foundUser = await findOneUser({
            [Op.or]: [{ email: req.body?.email }, { username: req.body?.username }]
          })
          if (foundUser) {
            throw new BadRequestError({ message: 'Email or username already taken!' })
          }

          return true
        }
      }
    },
    password: {
      ...isPassword
    },
    fullName: {
      ...isRequired('fullName'),
      ...isLength({ fieldName: 'fullName' })
    }
  })
)
