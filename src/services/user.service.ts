import { CreateUserBodyReq } from '~/dto/req/user/createUserBody.req'
import { UpdateUserBodyReq } from '~/dto/req/user/updateUserBody.req'
import { Role } from '~/entities/role.entity'
import { userRepository } from '~/repositories/user.repository'
import { unGetData } from '~/utils'
import { hashData } from '~/utils/jwt'

class UserService {
  createUser = async ({ email, username, avatar, fullName, password, roleId }: CreateUserBodyReq) => {
    //save user in db
    const hashPassword = hashData(password),
      role = { id: roleId } as Role

    const createdUser = await userRepository.saveOne({
      email,
      username,
      avatar,
      fullName,
      password: hashPassword,
      role
    })

    return unGetData({ fields: ['password'], object: createdUser })
  }

  updateUser = async (id: number, { email, username, fullName, roleId, avatar, status }: UpdateUserBodyReq) => {
    const updatedUser = await userRepository.updateOne({
      id,
      email,
      username,
      fullName,
      avatar,
      status,
      roleId
    })

    return unGetData({ fields: ['password'], object: updatedUser })
  }
}

export const userService = new UserService()
