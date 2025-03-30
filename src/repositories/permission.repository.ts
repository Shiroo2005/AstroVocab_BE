import { WhereOptions } from 'sequelize'
import { Permission } from '~/entities/permission.entity'
import { unGetData } from '~/utils'

class PermissionRepository {
  create = async (permission: Permission) => {
    const createdPermission = await Permission.create(permission)
    return createdPermission
  }

  find = async ({
    condition,
    unGetFields,
    isRaw = true
  }: {
    condition: WhereOptions
    status?: string
    unGetFields?: string[]
    isRaw?: boolean
  }) => {
    const foundPermissions = await Permission.findAll({
      where: {
        ...condition
      },
      raw: isRaw
    })

    if (!foundPermissions) return null

    return foundPermissions.map((permission) => {
      return unGetData({ fields: unGetFields, object: permission })
    })
  }
}

export const permissionRepository = new PermissionRepository()
