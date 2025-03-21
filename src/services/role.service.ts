import { isNumber, parseInt } from 'lodash'
import { BadRequestError } from '~/core/error.response'
import { CreateRoleBodyReq } from '~/dto/req/roles/createRoleBody.req'
import { Role } from '~/entities/role.entitity'
import { User } from '~/entities/user.entity'
import { isValidNumber } from '~/utils'

class RoleService {
  createRole = async ({ name, description }: CreateRoleBodyReq) => {
    const createdRole = await Role.create({ name, description }, { returning: true })
    return createdRole
  }

  getAllRole = async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
    const offset = (page - 1) * limit
    const [foundRoles, total] = await Promise.all([
      Role.findAll({
        limit,
        offset,
        where: {
          isDeleted: false
        }
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
    console.log(id)

    const foundRole = await Role.findByPk(id)
    if (!foundRole) return {}
    else return foundRole
  }

  putRoleById = async ({ id, name, description }: { id: string; name: string; description?: string }) => {
    const updatedRole = await Role.update(
      {
        name,
        description
      },
      {
        where: {
          id
        }
      }
    )

    return updatedRole
  }

  deleteRoleById = async ({ id }: { id: string }) => {
    return await Role.update({ isDeleted: true }, { where: { id } })
  }
}

export const roleService = new RoleService()
