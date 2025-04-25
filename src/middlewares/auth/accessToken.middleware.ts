import { Request } from 'express'
import { checkSchema } from 'express-validator'
import { TokenType } from '~/constants/token'
import { AuthRequestError, BadRequestError } from '~/core/error.response'
import { User } from '~/entities/user.entity'
import { userRepository } from '~/repositories/user.repository'
import { verifyToken } from '~/utils/jwt'
import { validateSchema } from '~/utils/validate'

export const accessTokenValidation = validateSchema(
  checkSchema(
    {
      authorization: {
        custom: {
          options: async (value: string, { req }) => {
            if (!value || value.length === 0) throw new AuthRequestError('Access token is required!')
            const accessToken = value.split(' ')[1]
            if (accessToken.length == 0) throw new AuthRequestError('Access token invalid!')

            try {
              // decoded
              const decodedAuthorization = await verifyToken({ token: accessToken })
              ;(req as Request).decodedAuthorization = decodedAuthorization

              // set User
              const { userId, tokenType } = decodedAuthorization

              //check type token
              if (tokenType != TokenType.accessToken) throw new BadRequestError('Token invalid!')

              const foundUser = await userRepository
                .findUserAndJoinRole()
                .where('user.id = :id', { id: userId })
                .getOne()

              if (foundUser) {
                ;(req as Request).user = foundUser as User
              } else throw new AuthRequestError('Please log in again!')
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
