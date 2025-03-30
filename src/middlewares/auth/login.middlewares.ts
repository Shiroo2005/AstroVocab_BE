import { checkSchema } from 'express-validator'
import { isRequired } from '../common.middlewares'
import { Op } from 'sequelize'
import { BadRequestError } from '~/core/error.response'
import { validate } from '~/utils/validate'
import { compareBcrypt } from '~/utils/jwt'
import { Request } from 'express'
import { User } from '~/entities/user.entity'
import { userRepository } from '~/repositories/user.repository'

// Validate login
export const loginValidation = validate(
  checkSchema(
    {
      username: {
        trim: true,
        ...isRequired('Username'),
        custom: {
          options: async (value, { req }) => {
            const foundUser = (await userRepository.findOneUser({
              condition: {
                [Op.or]: [{ [Op.and]: [{ email: value }] }, { [Op.and]: [{ username: value }] }]
              }
            })) as User

            if (!foundUser || !compareBcrypt(req.body?.password, foundUser.password)) {
              throw new BadRequestError('Username or password incorrect!')
            }

            ;(req as Request).user = foundUser as User

            return true
          }
        }
      },
      password: {
        trim: true,
        ...isRequired('Password')
      }
    },
    ['body']
  )
)
