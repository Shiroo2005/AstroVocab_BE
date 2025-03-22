import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CREATED, SuccessResponse } from '~/core/success.response'
import { LoginBodyReq } from '~/dto/req/auth/loginBody.req'
import { RegisterBodyReq } from '~/dto/req/auth/registerBody.req'
import { userService } from '~/services/user.service'

export const registerController = async (req: Request<ParamsDictionary, any, RegisterBodyReq>, res: Response) => {
  return new CREATED({
    metaData: await userService.register(req.body)
  }).send(res)
}

export const loginController = async (req: Request<ParamsDictionary, any, LoginBodyReq>, res: Response) => {
  return new SuccessResponse({
    metaData: await userService.login(req.body)
  }).send(res)
}
