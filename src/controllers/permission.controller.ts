import { Request, Response } from 'express'
import { CREATED, SuccessResponse } from '~/core/success.response'
import { UpdatePermissionBodyReq } from '~/dto/req/permission/updatePermissionBody.req'
import { permissionService } from '~/services/permission.service'
import { ParamsDictionary } from 'express-serve-static-core'
import { CreatePermissionBodyReq } from '~/dto/req/permission/createPermissionBody.req'
import { roleService } from '~/services/role.service'
import { toNumber } from 'lodash'

export const createPermissionController = async (
  req: Request<ParamsDictionary, any, CreatePermissionBodyReq>,
  res: Response
) => {
  return new CREATED({
    message: 'Create permissions successful!',
    metaData: await permissionService.createPermission(req.body)
  }).send(res)
}

export const findPermissonController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const roleId = (req as Request).idParams as number

  return new SuccessResponse({
    message: 'Find permissions by role successful!',
    metaData: await permissionService.findPermissionByRole({ roleId })
  }).send(res)
}

export const updatePermissionController = async (
  req: Request<ParamsDictionary, any, UpdatePermissionBodyReq>,
  res: Response
) => {
  const id = (req as Request).idParams as number

  return new SuccessResponse({
    message: 'Update permissions successful!',
    metaData: await permissionService.updatePermission({ ...req.body, id })
  }).send(res)
}

export const deletePermissionController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const id = toNumber(req.params.id)

  return new SuccessResponse({
    message: 'Delete permissions successful!',
    metaData: await permissionService.deletePermission(id)
  }).send(res)
}
