import { checkSchema } from 'express-validator'
import { validateSchema } from '~/utils/validate'
import { isRequired } from '../common.middlewares'
import { verifyToken } from '~/utils/jwt'
import { Request } from 'express'
import { AuthRequestError, BadRequestError } from '~/core/error.response'
import { emailVerificationTokenRepository } from '~/repositories/emailVerificationToken.repository'

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

              //find email token in db
              const foundToken = await emailVerificationTokenRepository.findOne({
                token
              })

              if (!foundToken) throw new BadRequestError('Token invalid!')
            } catch (error) {
              if (error === 'jwt expired') throw new AuthRequestError('Verify email token expired!')
              throw error
            }

            return true
          }
        }
      }
    },
    ['body']
  )
)
