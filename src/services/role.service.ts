import { CreateRoleBodyReq } from '~/dto/req/roles/createRoleBody.req'
import { Role } from '~/entities/role.entity'
import { RolePermission } from '~/entities/rolePermission.entity'
import { permissionService } from './permission.service'

class RoleService {
  createRole = async ({ name, description, permissionIds }: CreateRoleBodyReq) => {
    const createdRole = await Role.create({ name, description }, { returning: true })

    // create ROLE_PERMISSION
    if (permissionIds && permissionIds.length > 0) {
      console.log('cacassacsac')

      const transforPermissions = permissionIds.map((permissionId) => ({
        roleId: createdRole.id as number,
        permissionId: permissionId
      }))
      await RolePermission.bulkCreate(transforPermissions)
    }
    return createdRole
  }

  getAllRole = async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
    // parse
    page = Number(page)
    limit = Number(limit)

    const offset = (page - 1) * limit

    const [foundRoles, total] = await Promise.all([
      Role.findAll({
        limit: limit,
        offset,
        where: {
          isDeleted: false
        },
        attributes: ['id', 'name', 'description']
      }),
      Role.count({
        where: {
          isDeleted: false
        }
      })
    ])

    return {
      foundRoles,
      page,
      limit,
      total
    }
  }

  getRoleById = async (id: string) => {
    const foundRole = await Role.findByPk(id, {
      attributes: ['id', 'name', 'description']
    })
    if (!foundRole) return {}
    const permissions = await permissionService.findPermissionByRole(Number(id))

    return {
      foundRole,
      permissions
    }
  }

  putRoleById = async ({
    id,
    name,
    description,
    permissionIds
  }: {
    id: string
    name: string
    description?: string
    permissionIds?: number[]
  }) => {
    const updatedRole = await Role.update(
      {
        name,
        description
      },
      {
        where: {
          id
        },
        returning: true
      }
    )

    // update rolePermission
    if (permissionIds && permissionIds.length > 0) {
      const rolePermissions = permissionIds?.map((permissionId) => {
        return {
          roleId: Number(id),
          permissionId: permissionId as number
        }
      })

      await RolePermission.bulkCreate(rolePermissions, { ignoreDuplicates: true })
    }
    return updatedRole
  }

  deleteRoleById = async ({ id }: { id: string }) => {
    // delete rolePermission
    await RolePermission.destroy({
      where: {
        roleId: id
      }
    })

    // delete role
    return await Role.update({ isDeleted: true }, { where: { id } })
  }
}

export const roleService = new RoleService()
