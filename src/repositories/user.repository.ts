import { Op, WhereOptions } from 'sequelize'
import { UserStatus } from '~/constants/userStatus'
import { User } from '~/entities/user.entity'
import { unGetData } from '~/utils'

class UserRepository {
  findOneUser = async ({
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

    if (!foundUser) return null

    return unGetData({ fields: unGetFields, object: foundUser?.dataValues })
  }
}

export const userRepository = new UserRepository()
