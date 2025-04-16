import { CreateRoleBodyReq } from '~/dto/req/role/createRoleBody.req'
import { Role } from '~/entities/role.entity'
import { roleRepository } from '~/repositories/role.repository'
import { BadRequestError } from '~/core/error.response'

class RoleService {
  createRole = async ({ name, description }: CreateRoleBodyReq) => {
    const createdRole = await roleRepository.save({ name, description })

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
        data: [],
        page,
        limit,
        total: 0
      }
    }
    const { data, total } = result
    return {
      data,
      page,
      limit,
      total
    }
  }

  getRoleById = async (id: number) => {
    const foundRole = await roleRepository.findOne(
      { id },
      {
        relations: ['permissions']
      }
    )

    if (!foundRole) return {}

    return {
      foundRole
    }
  }

  isExistRoleId = async (id: number) => {
    const foundRole = roleRepository.findOne({
      id
    })

    return foundRole
  }

  updateRoleById = async ({ id, name, description }: { id: number; name: string; description?: string }) => {
    // find role
    const foundRole = await roleRepository.findOne({
      id
    })

    if (!foundRole) throw new BadRequestError(`Role with ${id} not found!`)

    // change data
    foundRole.name = name
    foundRole.description = description

    // save role
    return await roleRepository.save(foundRole)
  }

  deleteRoleById = async ({ id }: { id: number }) => {
    // soft delete
    const result = await roleRepository.softDelete({ id })
    return result
  }

  findPermissionByRole = async ({ roleId }: { roleId: number }) => {
    const foundRole = (await roleRepository.findOne(
      { id: roleId },
      {
        relations: ['permissions']
      }
    )) as Role | null

    if (!foundRole) return []
    return foundRole.permissions
  }
}

export const roleService = new RoleService()
