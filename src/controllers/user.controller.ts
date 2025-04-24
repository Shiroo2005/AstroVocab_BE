import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CREATED, SuccessResponse } from '~/core/success.response'
import { CreateUserBodyReq } from '~/dto/req/user/createUserBody.req'
import { UpdateUserBodyReq } from '~/dto/req/user/updateUserBody.req'
import { getOrSetCache } from '~/middlewares/redis/redis.middleware'
import { userService } from '~/services/user.service'
import { buildCacheKey } from '~/utils/redis'

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

  //build key for redis
  const key = buildCacheKey(req.baseUrl + req.path, {})

  return new SuccessResponse({
    message: 'Get user by id successful!',
    metaData: await getOrSetCache(key, () => userService.getUserById(id))
  }).send(res)
}

export const getAllUsers = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  //build key for redis
  const key = buildCacheKey(req.baseUrl + req.path, { ...req.params, ...req.query })

  return new SuccessResponse({
    message: 'Get all users successful!',
    metaData: await getOrSetCache(key, () =>
      userService.getAllUsers({ ...req.query, ...req.parseQueryPagination, sort: req.sortParsed })
    )
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
