import { Request } from 'express'
import { checkSchema } from 'express-validator'
import { BadRequestError } from '~/core/error.response'
import { tokenRepository } from '~/repositories/token.repository'
import { verifyToken } from '~/utils/jwt'
import { validateSchema } from '~/utils/validate'

export const refreshTokenValidation = validateSchema(
  checkSchema(
    {
      refreshToken: {
        custom: {
          options: async (value: string, { req }) => {
            // check refresh token valid
            try {
              console.log(value)

              const decodedRefreshToken = await verifyToken({ token: value })
              ;(req as Request).decodedRefreshToken = decodedRefreshToken
            } catch (error) {
              if (error === 'jwt expired') throw new BadRequestError('Refresh token expired!')
              throw error
            }

            // can refresh token use ?
            const foundToken = await tokenRepository.findOne({
              where: {
                refreshToken: value
              }
            })

            // access and refresh token must be 1 userId
            const decodedAuthorization = (req as Request).decodedAuthorization
            const decodedRefreshToken = (req as Request).decodedRefreshToken
            if (decodedAuthorization && decodedAuthorization.userId != decodedRefreshToken?.userId)
              throw new BadRequestError('Access and refresh token must belong to the same user!')

            if (!foundToken) throw new BadRequestError('Please login again!')

            return true
          }
        }
      }
    },
    ['body']
  )
)
