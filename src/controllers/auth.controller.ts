import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { UserStatus } from '~/constants/userStatus'
import { CREATED, SuccessResponse } from '~/core/success.response'
import { LoginBodyReq } from '~/dto/req/auth/loginBody.req'
import { LogoutBodyReq } from '~/dto/req/auth/logoutBody.req'
import { RegisterBodyReq } from '~/dto/req/auth/registerBody.req'
import { User } from '~/entities/user.entity'
import { userService } from '~/services/user.service'

export const registerController = async (req: Request<ParamsDictionary, any, RegisterBodyReq>, res: Response) => {
  return new CREATED({
    metaData: await userService.register(req.body)
  }).send(res)
}

export const loginController = async (req: Request<ParamsDictionary, any, LoginBodyReq>, res: Response) => {
  const user = req.user as User

  return new SuccessResponse({
    metaData: await userService.login({ userId: user.id as number, status: user.status as UserStatus })
  }).send(res)
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutBodyReq>, res: Response) => {
  const { refreshToken } = req.body

  return new SuccessResponse({
    metaData: await userService.logout({ refreshToken })
  }).send(res)
}
