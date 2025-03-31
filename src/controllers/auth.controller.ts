import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { UserStatus } from '~/constants/userStatus'
import { CREATED, SuccessResponse } from '~/core/success.response'
import { TokenPayload } from '~/dto/common.dto'
import { LoginBodyReq } from '~/dto/req/auth/loginBody.req'
import { LogoutBodyReq } from '~/dto/req/auth/logoutBody.req'
import { RegisterBodyReq } from '~/dto/req/auth/registerBody.req'
import { Role } from '~/entities/role.entity'
import { User } from '~/entities/user.entity'
import { userService } from '~/services/user.service'

export const registerController = async (req: Request<ParamsDictionary, any, RegisterBodyReq>, res: Response) => {
  return new CREATED({
    message: 'Register successful!',
    metaData: await userService.register(req.body)
  }).send(res)
}

export const loginController = async (req: Request<ParamsDictionary, any, LoginBodyReq>, res: Response) => {
  const user = req.user as User

  return new SuccessResponse({
    message: 'Login successful!',
    metaData: await userService.login({
      userId: user.id as number,
      status: user.status as UserStatus,
      role: user.role as Role
    })
  }).send(res)
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutBodyReq>, res: Response) => {
  const { refreshToken } = req.body

  return new SuccessResponse({
    message: 'Logout successful!',
    metaData: await userService.logout({ refreshToken })
  }).send(res)
}

export const refreshTokenController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { decodedRefreshToken } = req as Request

  return new SuccessResponse({
    message: 'Get new tokens successful!',
    metaData: await userService.newToken(decodedRefreshToken as TokenPayload)
  }).send(res)
}

export const accountController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { decodedAuthorization } = req as Request

  return new SuccessResponse({
    message: 'Get account successful!',
    metaData: await userService.getAccount(decodedAuthorization as TokenPayload)
  }).send(res)
}
