import { CreateRoleBodyReq } from '~/dto/req/role/createRoleBody.req'
import { Role } from '~/entities/role.entity'
import { roleRepository } from '~/repositories/role.repository'
import { BadRequestError } from '~/core/error.response'

class RoleService {
  createRole = async ({ name, description, permissionIds }: CreateRoleBodyReq) => {
    const createdRole = await roleRepository.saveOne({ name, description })

    return createdRole
  }

  getAllRoles = async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
    // parse
    page = Number(page)
    limit = Number(limit)

    const result = await roleRepository.findAll({
      limit,
      page
    })
    if (!result) {
      return {
        foundRoles: [],
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
      where: {
        id
      },
      relations: ['permissions']
    })

    if (!foundRole) return {}

    return {
      foundRole
    }
  }

  isExistRoleId = async (id: number) => {
    const foundRole = roleRepository.findOne({
      where: {
        id
      }
    })

    return foundRole
  }

  updateRoleById = async ({ id, name, description }: { id: number; name: string; description?: string }) => {
    // find role
    const foundRole = (await roleRepository.findOne({
      where: {
        id
      }
    })) as Role | null

    if (!foundRole) throw new BadRequestError(`Role with ${id} not found!`)

    // change data
    foundRole.name = name
    foundRole.description = description

    // save role
    return await roleRepository.saveOne(foundRole)
  }

  deleteRoleById = async ({ id }: { id: number }) => {
    // soft delete
    const result = await roleRepository.softDelete({ where: { id } })
    return result
  }

  findPermissionByRole = async ({ roleId }: { roleId: number }) => {
    const foundRole = (await roleRepository.findOne({
      where: {
        id: roleId
      },
      relations: ['permissions']
    })) as Role | null

    if (!foundRole) return []
    return foundRole.permissions
  }
}

export const roleService = new RoleService()
