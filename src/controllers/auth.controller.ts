import { Query } from 'accesscontrol'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import passport from 'passport'
import { env } from 'process'
import { OAUTH_PROVIDER } from '~/constants/oauth'
import { BadRequestError } from '~/core/error.response'
import { CREATED, SuccessResponse } from '~/core/success.response'
import { TokenPayload } from '~/dto/common.dto'
import { LoginBodyReq } from '~/dto/req/auth/loginBody.req'
import { LogoutBodyReq } from '~/dto/req/auth/logoutBody.req'
import { RegisterBodyReq } from '~/dto/req/auth/registerBody.req'
import { Role } from '~/entities/role.entity'
import { User } from '~/entities/user.entity'
import { authService } from '~/services/auth.service'
import { isValidEnumValue } from '~/utils'

export const registerController = async (req: Request<ParamsDictionary, any, RegisterBodyReq>, res: Response) => {
  return new CREATED({ message: 'Register successful!', metaData: await authService.register(req.body) }).send(res)
}

export const sendVerificationEmailController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const user = req.user as User
  authService
    .sendVerifyEmail({ email: user.email, name: user.fullName, userId: user.id as number })
    .catch((err) => console.error('Error when send verify email', err))
    .then((res) => {
      console.log(`Send verification email successful with url = ${res}`)
      return
    })

  return new SuccessResponse({ message: 'Send verification email successful!' }).send(res)
}

export const loginController = async (req: Request<ParamsDictionary, any, LoginBodyReq>, res: Response) => {
  const user = req.user as User

  return new SuccessResponse({
    message: 'Login successful!',
    metaData: await authService.login({
      userId: user.id as number,
      roleId: user.role.id as number
    })
  }).send(res)
}

export const oauthLoginController = async (req: Request, res: Response) => {
  const provider = req.params.provider
  console.log(provider)

  if (!provider || !isValidEnumValue(provider, OAUTH_PROVIDER)) throw new BadRequestError('Provider invalid!')

  passport.authenticate(provider, { scope: ['profile', 'email'], session: false })(req, res)
}

export const oauthLoginCallbackController = async (req: Request, res: Response) => {
  const provider = req.params.provider
  if (!provider || !isValidEnumValue(provider, OAUTH_PROVIDER)) throw new BadRequestError('Provider invalid!')
  passport.authenticate(provider, { session: false }, async (err: any, user: User, info: any) => {
    if (err || !user) {
      throw new BadRequestError('Login failed!')
    }

    const { accessToken, refreshToken } = await authService.login({
      userId: user.id as number,
      roleId: user.role.id as number
    })
    const FE_URL = env.FE_URL as string
    res.redirect(`${FE_URL}?accessToken=${accessToken}&refreshToken=${refreshToken}`)
  })(req, res)
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutBodyReq>, res: Response) => {
  const { refreshToken } = req.body

  return new SuccessResponse({
    message: 'Logout successful!',
    metaData: await authService.logout({ refreshToken })
  }).send(res)
}

export const refreshTokenController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { user } = req as Request

  return new SuccessResponse({
    message: 'Get new tokens successful!',
    metaData: await authService.newToken({ userId: user?.id as number, roleId: user?.role.id as number })
  }).send(res)
}

export const accountController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { user } = req as Request

  return new SuccessResponse({
    message: 'Get account successful!',
    metaData: await authService.getAccount({ user: user as User })
  }).send(res)
}

export const verifyEmailTokenController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { decodedEmailToken } = req as Request

  return new SuccessResponse({
    message: 'Verify email successful!',
    metaData: await authService.verifyEmail(decodedEmailToken as TokenPayload)
  }).send(res)
}
