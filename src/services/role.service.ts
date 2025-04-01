import { CreateRoleBodyReq } from '~/dto/req/roles/createRoleBody.req'
import { Role } from '~/entities/role.entity'
import { roleRepository } from '~/repositories/role.repository'
import { Permission } from '~/entities/permission.entity'
import { BadRequestError } from '~/core/error.response'

class RoleService {
  createRole = async ({ name, description, permissionIds }: CreateRoleBodyReq) => {
    const permissions = permissionIds?.map((permissionId) => ({ id: permissionId }) as Permission)

    const createdRole = await roleRepository.saveOne({ name, description, permissions })

    return createdRole
  }

  getAllRole = async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
    // parse
    page = Number(page)
    limit = Number(limit)

    const result = await roleRepository.findAll({
      limit,
      page
    })
    if (!result) {
      return {
        foundRoles: {},
        page,
        limit,
        total: 0
      }
    }
    const { foundRoles, total } = result
    return {
      foundRoles,
      page,
      limit,
      total
    }
  }

  getRoleById = async (id: number) => {
    const foundRole = await roleRepository.findOne({
      conditions: {
        id
      },
      relations: ['permissions']
    })

    if (!foundRole) return {}

    return {
      foundRole
    }
  }

  updateRoleById = async ({
    id,
    name,
    description,
    permissionIds
  }: {
    id: number
    name: string
    description?: string
    permissionIds?: number[]
  }) => {
    const permissions = permissionIds?.map((permissionId) => ({ id: permissionId }) as Permission)

    // find role
    const foundRole = (await roleRepository.findOne({
      conditions: {
        id
      }
    })) as Role | null

    if (!foundRole) throw new BadRequestError(`Role with ${id} not found!`)

    // change data
    foundRole.name = name
    foundRole.description = description
    if (permissions) foundRole.permissions = permissions

    console.log(foundRole)

    // save role
    return await roleRepository.saveOne(foundRole)
  }

  deleteRoleById = async ({ id }: { id: number }) => {
    // soft delete
    const result = await roleRepository.softDelete({ conditions: { id } })
    return result
  }

  findPermissionByRole = async ({ roleId }: { roleId: number }) => {
    const foundRole = (await roleRepository.findOne({
      conditions: {
        id: roleId
      },
      relations: ['permissions']
    })) as Role | null

    if (!foundRole) return []
    return foundRole.permissions
  }
}

export const roleService = new RoleService()
