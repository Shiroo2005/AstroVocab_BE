import { WhereOptions } from 'sequelize'
import { User } from '~/entities/user.entity'

export const findOneUser = async (condition: WhereOptions) => {
  const foundUser = await User.findOne({
    where: condition
  })

  return foundUser?.dataValues
}
