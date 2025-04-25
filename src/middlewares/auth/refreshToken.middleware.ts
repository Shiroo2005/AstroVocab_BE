import { Request } from 'express'
import { checkSchema } from 'express-validator'
import { now, toNumber } from 'lodash'
import { env } from 'process'
import { BadRequestError, NotFoundRequestError } from '~/core/error.response'
import { RefreshToken } from '~/entities/refreshToken.entity'
import { refreshTokenRepository } from '~/repositories/refreshToken.repository'
import { validateSchema } from '~/utils/validate'

export const refreshTokenValidation = validateSchema(
  checkSchema(
    {
      refreshToken: {
        custom: {
          options: async (value: string, { req }) => {
            // check refresh token valid
            //find token
            const rawToken = await refreshTokenRepository.findOneByTokenAndJoinUserAndRole({
              refreshToken: value,
              selectFields: ['refreshToken.createdAt, refreshToken.user, user.roleId', 'refreshToken.token']
            })

            //check expire time
            console.log(rawToken, !rawToken, !rawToken?.length)

            if (!rawToken || !rawToken.length || !rawToken[0]) throw new NotFoundRequestError('Token invalid!')

            const foundToken = rawToken[0] as RefreshToken
            const REFRESH_TOKEN_EXPIRE_TIME = toNumber(env.REFRESH_TOKEN_EXPIRE_TIME)
            const expiredAt = (foundToken.createdAt as Date).getTime() + REFRESH_TOKEN_EXPIRE_TIME

            if (expiredAt < now())
              throw new BadRequestError('Token expired!')

              //set user
            ;(req as Request).user = foundToken.user

            return true
          }
        }
      }
    },
    ['body']
  )
)
