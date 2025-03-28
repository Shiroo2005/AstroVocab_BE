import { Request, Response } from 'express'
import { CREATED } from '~/core/success.response'
import { CreatePermissionBodyReq } from '~/dto/req/permission/createPermissionBody.req'
import { permissionService } from '~/services/permission.service'
import { ParamsDictionary } from 'express-serve-static-core'
import { toNumber } from '~/utils'

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
  return new CREATED({
    message: 'Find permissions by role successful!',
    metaData: await permissionService.findPermissionByRole(toNumber(req.query.roleId as string))
  }).send(res)
}
