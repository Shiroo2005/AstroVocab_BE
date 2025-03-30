import { CreatePermissionBodyReq } from '~/dto/req/permission/createPermissionBody.req'
import { Permission } from '~/entities/permission.entity'
import { RolePermission } from '~/entities/rolePermission.entity'
import { permissionRepository } from '~/repositories/permission.repository'

class PermissionService {
  createPermission = async (permission: CreatePermissionBodyReq) => {
    console.log(permission)

    // create permission
    const createdPermission = await permissionRepository.create(permission.permission)

    return createdPermission
  }

  findPermissionByRole = async (roleId: number) => {
    const foundRolePermission = await RolePermission.findAll({
      where: {
        roleId
      }
    })

    if (foundRolePermission.length == 0) {
      return []
    }

    const permissionIds = foundRolePermission.map((rp) => rp.permissionId)

    const foundPermissions = await permissionRepository.find({
      condition: {
        id: permissionIds
      }
    })

    if (!foundPermissions || foundPermissions.length == 0) {
      return []
    }

    return foundPermissions as Permission[]
  }
}

export const permissionService = new PermissionService()
