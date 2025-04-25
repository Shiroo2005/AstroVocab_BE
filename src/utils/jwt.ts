import bcrypt from 'bcrypt'
import { config } from 'dotenv'
import jwt, { SignOptions } from 'jsonwebtoken'
import { env } from 'process'
import { TokenType } from '~/constants/token'
import { UserStatus } from '~/constants/userStatus'
import { TokenPayload } from '~/dto/common.dto'
import { v4 as uuidv4 } from 'uuid'
import { toNumber } from 'lodash'
config()

const secretKey = env.JWT_SECRET_KEY as string

export const hashData = (data: string) => {
  return bcrypt.hashSync(data, 5)
}

export const compareBcrypt = (data: string, hashData: string) => {
  return bcrypt.compareSync(data, hashData)
}

export const signToken = ({ payload, optional }: { payload: string | Buffer | object; optional?: SignOptions }) => {
  optional = { ...optional, algorithm: 'HS256' }
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, secretKey, { ...optional, jwtid: uuidv4() }, (err, token) => {
      if (err) {
        reject(err)
      }
      resolve(token as string)
    })
  })
}

export const signAccessToken = async ({ userId, roleId }: { userId: number; status?: UserStatus; roleId: number }) => {
  return await signToken({
    payload: { userId, roleId, tokenType: TokenType.accessToken },
    optional: { expiresIn: toNumber(process.env.ACCESS_TOKEN_EXPIRE_TIME) }
  })
}

export const signRefreshToken = async () => {
  return uuidv4()
}

export const signEmailVerificationToken = async ({ userId }: { userId: number }) => {
  const token = await signToken({
    payload: { userId, tokenType: TokenType.emailVerifyToken },
    optional: { expiresIn: toNumber(process.env.VERIFICATION_EMAIL_EXPIRE_TIME) }
  })
  return token
}

export const verifyToken = async ({ token }: { token: string }) => {
  return jwt.verify(token, secretKey) as TokenPayload
}
