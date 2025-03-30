import { WhereOptions } from 'sequelize'
import { Role } from '~/entities/role.entity'
import { unGetData } from '~/utils'

class RoleRepository {
  findOneRole = async ({ condition, unGetFields }: { condition: WhereOptions; unGetFields?: string[] }) => {
    const foundRole = await Role.findOne({
      where: condition
    })

    if (!foundRole) return null

    return unGetData({ fields: unGetFields, object: foundRole?.dataValues })
  }
}

export const roleRepository = new RoleRepository()
