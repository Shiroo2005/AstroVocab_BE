import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { CreateRoleBodyReq } from '~/dto/req/role/createRoleBody.req'
import { CREATED, SuccessResponse } from '../core/success.response'
import { roleService } from '~/services/role.service'
import { UpdateRoleBodyReq } from '~/dto/req/role/updateRoleBody.req'
import { toNumber } from 'lodash'

export const createRole = async (
  req: Request<ParamsDictionary, any, CreateRoleBodyReq>,
  res: Response,
  next: NextFunction
) => {
  return new CREATED({
    message: 'Create new role successful!',
    metaData: await roleService.createRole(req.body)
  }).send(res)
}

export const getAllRoles = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
  return new SuccessResponse({
    message: 'Get all roles successful!',
    metaData: await roleService.getAllRoles(req.query)
  }).send(res)
}

export const getRole = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
  const searchId = toNumber(req.params?.id)

  return new SuccessResponse({
    message: 'Get role by id successful!',
    metaData: await roleService.getRoleById(searchId)
  }).send(res)
}

export const updateRole = async (
  req: Request<ParamsDictionary, any, UpdateRoleBodyReq>,
  res: Response,
  next: NextFunction
) => {
  const searchId = (req as Request).idParams as number

  return new SuccessResponse({
    message: 'Update role by id successful!',
    metaData: await roleService.updateRoleById({ ...req.body, id: searchId })
  }).send(res)
}

export const deleteRoleById = async (req: Request<ParamsDictionary, any, UpdateRoleBodyReq>, res: Response) => {
  const searchId = toNumber(req.params?.id)

  return new SuccessResponse({
    message: 'Delete role by id successful!',
    metaData: await roleService.deleteRoleById({ id: searchId })
  }).send(res)
}
