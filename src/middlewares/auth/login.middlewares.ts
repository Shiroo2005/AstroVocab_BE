import { checkSchema } from 'express-validator'
import { isRequired } from '../common.middlewares'
import { validateSchema } from '~/utils/validate'

// Validate login
export const loginValidation = validateSchema(
  checkSchema(
    {
      identifier: {
        trim: true,
        ...isRequired('identifier')
      },
      password: {
        trim: true,
        ...isRequired('password')
      }
    },
    ['body']
  )
)
