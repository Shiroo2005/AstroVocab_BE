import { Op, WhereOptions } from 'sequelize'
import { UserStatus } from '~/constants/userStatus'
import { User } from '~/entities/user.entity'
import { unGetData } from '~/utils'

export const findOneUser = async ({
  condition,
  status,
  unGetFields
}: {
  condition: WhereOptions
  status?: string
  unGetFields?: string[]
}) => {
  const foundUser = await User.findOne({
    where: {
      ...condition,
      status: status ? status : { [Op.in]: [UserStatus.ACTIVE, UserStatus.NOT_VERIFIED] }
    }
  })

  if (!foundUser) return {}

  return unGetData({ fields: unGetFields, object: foundUser?.dataValues })
}
