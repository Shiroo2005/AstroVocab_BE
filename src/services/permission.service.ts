import { CreatePermissionBodyReq } from '~/dto/req/permission/createPermissionBody.req'
import { Permission } from '~/entities/permission.entity'
import { Role } from '~/entities/role.entity'
import { RolePermission } from '~/entities/rolePermission.entity'
import { create, find } from '~/repositories/permission.repository'
import { getInfoData } from '~/utils'

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

  findPermission = async (roleId: number) => {
    console.log('Hasccscskk', roleId)

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
    return foundPermissions
  }
}

export const permissionService = new PermissionService()
