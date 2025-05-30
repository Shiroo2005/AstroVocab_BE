import { checkSchema } from 'express-validator'
import { isEmail, isLength, isPassword, isRequired, isUsername } from '../common.middlewares'
import { BadRequestError } from '~/core/error.response'
import { validateSchema } from '~/utils/validate'
import { userRepository } from '~/repositories/user.repository'

// Validate Register
export const registerValidation = validateSchema(
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
            const foundUser = await userRepository
              .getQueryBuilder('user')
              .where('email = :email', { email: value })
              .orWhere('username = :username', { username: req.body.username })
              .withDeleted()
              .getCount()
            // const foundUser = (await userRepository.findOne([{ email: value }, { username: req.body.username }], {
            //   withDeleted: true
            // })) as User | null

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
      }
    },
    ['body']
  )
)
