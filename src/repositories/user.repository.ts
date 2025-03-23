import { Op, WhereOptions } from 'sequelize'
import { UserStatus } from '~/constants/userStatus'
import { User } from '~/entities/user.entity'

export const findOneUser = async (condition: WhereOptions, status?: string) => {
  const foundUser = await User.findOne({
    where: {
      ...condition,
      status: status ? status : { [Op.in]: [UserStatus.ACTIVE, UserStatus.NOT_VERIFIED] }
    }
  })

  return foundUser?.dataValues
}
