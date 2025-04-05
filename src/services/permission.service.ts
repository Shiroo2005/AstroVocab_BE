import { Action, Resource } from '~/constants/access'
import { BadRequestError } from '~/core/error.response'
import { CreatePermissionBodyReq } from '~/dto/req/permission/createPermissionBody.req'
import { Permission } from '~/entities/permission.entity'
import { permissionRepository } from '~/repositories/permission.repository'

class PermissionService {
  createPermission = async (permission: CreatePermissionBodyReq) => {
    // create permission
    const createdPermission = await permissionRepository.saveOne({
      action: permission.action as Action,
      resource: permission.resource as Resource
    })

    return createdPermission
  }

  updatePermission = async ({ id, action, resource }: { id: number; resource: Resource; action: Action }) => {
    const foundPermission = (await permissionRepository.findOne({ where: { id } })) as Permission | null
    if (!foundPermission) throw new BadRequestError('Permission not found!')

    // set data
    foundPermission.resource = resource
    foundPermission.action = action

    return await permissionRepository.saveOne(foundPermission)
  }

  deletePermission = async (id: number) => {
    return await permissionRepository.softDelete({ where: { id } })
  }
}

export const permissionService = new PermissionService()
