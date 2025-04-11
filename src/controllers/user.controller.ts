import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CREATED, SuccessResponse } from '~/core/success.response'
import { CreateUserBodyReq } from '~/dto/req/user/createUserBody.req'
import { UpdateUserBodyReq } from '~/dto/req/user/updateUserBody.req'
import { userService } from '~/services/user.service'

export const createUserController = async (req: Request<ParamsDictionary, any, CreateUserBodyReq>, res: Response) => {
  return new CREATED({
    message: 'Create user successful!',
    metaData: await userService.createUser(req.body)
  }).send(res)
}

export const updateUserController = async (req: Request<ParamsDictionary, any, UpdateUserBodyReq>, res: Response) => {
  const id = (req as Request).idParams as number

  return new SuccessResponse({
    message: 'Update user by id successful!',
    metaData: await userService.updateUser(id, req.body)
  }).send(res)
}

export const getUser = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const id = (req as Request).idParams as number

  return new SuccessResponse({
    message: 'Get user by id successful!',
    metaData: await userService.getUserById(id)
  }).send(res)
}

export const getAllUsers = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  return new SuccessResponse({
    message: 'Get all users successful!',
    metaData: await userService.getAllUsers({ ...req.query, sort: req.sortParsed })
  }).send(res)
}

export const deleteUserById = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const id = (req as Request).idParams as number

  return new SuccessResponse({
    message: 'Delete user by id successful!',
    metaData: await userService.deleteUserById({ id })
  }).send(res)
}

export const restoreUserById = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const id = (req as Request).idParams as number

  return new SuccessResponse({
    message: 'Restore user by id successful!',
    metaData: await userService.restoreUserById({ id })
  }).send(res)
}
