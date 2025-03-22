import { checkSchema } from 'express-validator'
import { isRequired } from '../common.middlewares'
import { findOneUser } from '~/repositories/user.repository'
import { Op } from 'sequelize'
import { BadRequestError } from '~/core/error.response'
import { validate } from '~/utils/validate'

// Validate login
export const loginValidation = validate(
  checkSchema({
    username: {
      ...isRequired('Username'),
      custom: {
        options: async (value, { req }) => {
          const foundUser = await findOneUser({
            [Op.or]: [
              { [Op.and]: [{ email: value }, { password: req.body?.password }] },
              { [Op.and]: [{ username: value }, { password: req.body?.password }] }
            ]
          })
          if (!foundUser) {
            throw new BadRequestError({ message: 'Email or username incorrect!' })
          }

          return true
        }
      }
    },
    password: {
      ...isRequired('Password')
    }
  })
)
