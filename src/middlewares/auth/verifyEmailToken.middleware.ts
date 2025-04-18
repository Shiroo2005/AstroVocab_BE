import { checkSchema } from 'express-validator'
import { validateSchema } from '~/utils/validate'
import { isRequired } from '../common.middlewares'

export const verifyEmailTokenValidation = validateSchema(
  checkSchema({ token: { ...isRequired('token'), custom: { options: (token) => {} } } }, ['body'])
)
