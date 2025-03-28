import { CreatePermissionBodyReq } from '~/dto/req/permission/createPermissionBody.req'
import { Permission } from '~/entities/permission.entity'
import { RolePermission } from '~/entities/rolePermission.entity'
import { create, find } from '~/repositories/permission.repository'

class PermissionService {
  createPermission = async (permissions: CreatePermissionBodyReq) => {
    // create permission
    const createdPermission = await create(permissions.permissions)

    // permisison_role
    await RolePermission.bulkCreate(
      createdPermission.map((permission) => {
        return {
          permissionId: permission.id as number,
          roleId: permissions.roleId
        }
      })
    )

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

    const foundPermissions = await find({
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
