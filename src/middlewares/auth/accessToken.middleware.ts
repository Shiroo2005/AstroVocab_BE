import { Request } from 'express'
import { checkSchema } from 'express-validator'
import { AuthRequestError } from '~/core/error.response'
import { User } from '~/entities/user.entity'
import { userRepository } from '~/repositories/user.repository'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validate'

export const accessTokenValidation = validate(
  checkSchema(
    {
      authorization: {
        custom: {
          options: async (value: string, { req }) => {
            const accessToken = value.split(' ')[1]
            if (accessToken.length == 0) throw new AuthRequestError('Access token invalid!')

            try {
              // decoded
              const decodedAuthorization = await verifyToken({ token: accessToken })
              ;(req as Request).decodedAuthorization = decodedAuthorization

              // set User
              const { userId } = decodedAuthorization
              const foundUser = await userRepository.findOne({
                where: {
                  id: userId
                },
                relations: ['role']
              })

              if (foundUser) {
                ;(req as Request).user = foundUser as User
              }
            } catch (error) {
              if (error === 'jwt expired') throw new AuthRequestError('Access token expired!')
              throw error
            }
            return true
          }
        }
      }
    },
    ['headers']
  )
)
