import { Request } from 'express'
import { checkSchema } from 'express-validator'
import { BadRequestError, NotFoundRequestError } from '~/core/error.response'
import { tokenRepository } from '~/repositories/token.repository'
import { userRepository } from '~/repositories/user.repository'
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
              const decodedRefreshToken = await verifyToken({ token: value })
              ;(req as Request).decodedRefreshToken = decodedRefreshToken

              await Promise.all([isUserIdValid(decodedRefreshToken.userId), isTokenInDb(value)])
            } catch (error) {
              if (error === 'jwt expired') throw new BadRequestError('Refresh token expired!')
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

const isUserIdValid = async (userId: number) => {
  //check if userId in refresh token is delete or invalid!
  const user = await userRepository
    .findUserById({
      id: userId,
      selectFields: ['user.id']
    })
    .getCount()

  if (!user) throw new NotFoundRequestError('Token invalid')
}

const isTokenInDb = async (refreshToken: string) => {
  // can refresh token use ?
  const foundToken = await tokenRepository
    .getQueryBuilder('token')
    .where('refreshToken = :refreshToken', { refreshToken })
    .getCount()

  if (!foundToken) throw new BadRequestError('Token invalid')
}
