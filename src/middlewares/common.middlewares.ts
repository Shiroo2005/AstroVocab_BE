import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { checkSchema } from 'express-validator'
import { AuthRequestError, BadRequestError } from '~/core/error.response'
import { Token } from '~/entities/token.entity'
import { isValidNumber } from '~/utils'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validate'

export const checkIdParamMiddleware = (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
  if (req.params?.id && !isValidNumber(req.params?.id)) {
    throw new BadRequestError('Id invalid!')
  } else next()
}

export const isRequired = (fieldName: string) => ({
  notEmpty: {
    errorMessage: `${fieldName} is required`
  }
})

export const isEmail = {
  isEmail: {
    errorMessage: 'Invalid email format'
  },
  normalizeEmail: true
}

export const isPassword = {
  isStrongPassword: {
    options: {
      minLength: 6,
      minLowercase: 0,
      minNumbers: 0,
      minSymbols: 0,
      minUppercase: 1
    },
    errorMessage: 'Password must be at least 8 characters'
  }
}

export const isUsername = {
  isLength: {
    options: { min: 6 },
    errorMessage: 'Username must be at least 6 characters'
  },
  matches: {
    options: /^[a-zA-Z0-9]+$/,
    errorMessage: 'Only letters and numbers are allowed'
  }
}

export const isLength = ({ fieldName, min = 6, max = 30 }: { fieldName: string; min?: number; max?: number }) => ({
  isLength: {
    options: {
      min,
      max
    },
    errorMessage: `${fieldName} length must be between ${min} and ${max}`
  }
})

export const accessTokenValidation = validate(
  checkSchema(
    {
      authorization: {
        custom: {
          options: async (value: string, { req }) => {
            const accessToken = value.split(' ')[1]
            if (accessToken.length == 0) throw new AuthRequestError('Access token invalid!')

            try {
              const decodedAuthorization = await verifyToken({ token: accessToken })
              ;(req as Request).decodedAuthorization = decodedAuthorization

              console.log(decodedAuthorization)
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

export const refreshTokenValidation = validate(
  checkSchema(
    {
      refreshToken: {
        custom: {
          options: async (value: string, { req }) => {
            // check refresh token valid
            try {
              const decodedRefreshToken = await verifyToken({ token: value })
              ;(req as Request).decodedRefreshToken = decodedRefreshToken
            } catch (error) {
              if (error === 'jwt expired') throw new BadRequestError('Refresh token expired!')
              throw error
            }

            // can refresh token use ?
            const foundToken: Token[] = await Token.findAll({
              where: {
                refreshToken: value
              }
            })

            // access and refresh token must be 1 userId
            const decodedAuthorization = (req as Request).decodedAuthorization
            const decodedRefreshToken = (req as Request).decodedRefreshToken
            if (decodedAuthorization && decodedAuthorization.userId != decodedRefreshToken?.userId)
              throw new BadRequestError('Access and refresh token must belong to the same user!')

            if (!foundToken || (foundToken as Token[]).length == 0) throw new BadRequestError('Please login again!')

            return true
          }
        }
      }
    },
    ['body']
  )
)
