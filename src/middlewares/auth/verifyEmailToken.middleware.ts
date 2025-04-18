import { checkSchema } from 'express-validator'
import { validateSchema } from '~/utils/validate'
import { isRequired } from '../common.middlewares'
import { verifyToken } from '~/utils/jwt'
import { Request } from 'express'
import { AuthRequestError } from '~/core/error.response'

export const verifyEmailTokenValidation = validateSchema(
  checkSchema(
    {
      token: {
        ...isRequired('token'),
        custom: {
          options: async (token, { req }) => {
            try {
              // decoded
              const decodedEmailToken = await verifyToken({ token })
              ;(req as Request).decodedEmailToken = decodedEmailToken
            } catch (error) {
              if (error === 'jwt expired') throw new AuthRequestError('Verify email token expired!')
              throw error
            }
          }
        }
      }
    },
    ['body']
  )
)
