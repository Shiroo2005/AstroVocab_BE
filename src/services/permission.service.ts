import { Action, Resource } from '~/constants/access'
import { CreatePermissionBodyReq } from '~/dto/req/permission/createPermissionBody.req'
import { Permission } from '~/entities/permission.entity'
import { RolePermission } from '~/entities/rolePermission.entity'
import { permissionRepository } from '~/repositories/permission.repository'

class PermissionService {
  createPermission = async (permission: CreatePermissionBodyReq) => {
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

  updatePermission = async ({ roleId, action, resource }: { roleId: number; resource: Resource; action: Action }) => {
    const updatedPermission = await Permission.update(
      { action, resource },
      {
        where: {
          id: roleId
        }
      }
    )

    return updatedPermission
  }

  deletePermission = async (id: number) => {
    // delete RolePermission
    await RolePermission.destroy({
      where: {
        permissionId: id
      }
    })

    // isDeleted = true
    return await Permission.update(
      {
        isDeleted: true
      },
      {
        where: {
          id
        },
        returning: true
      }
    )
  }
}

export const permissionService = new PermissionService()
