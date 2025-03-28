import { WhereOptions } from 'sequelize'
import { Role } from '~/entities/role.entity'
import { unGetData } from '~/utils'

export const findOneRole = async ({ condition, unGetFields }: { condition: WhereOptions; unGetFields?: string[] }) => {
  const foundRole = await Role.findOne({
    where: condition
  })

  if (!foundRole) return {}

  return unGetData({ fields: unGetFields, object: foundRole?.dataValues })
}
