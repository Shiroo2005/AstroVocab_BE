import { CreateUserBodyReq } from '~/dto/req/user/createUserBody.req'
import { UpdateUserBodyReq } from '~/dto/req/user/updateUserBody.req'
import { Role } from '~/entities/role.entity'
import { userRepository } from '~/repositories/user.repository'
import { unGetData } from '~/utils'

class UserService {
  createUser = async ({ email, username, avatar, fullName, password, roleId }: CreateUserBodyReq) => {
    //save user in db
    const role = { id: roleId } as Role

    const createdUser = await userRepository.saveOne({
      email,
      username,
      avatar,
      fullName,
      password,
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

  getUserById = async (id: number) => {
    const foundUser = await userRepository.findOne({
      where: { id },
      unGetFields: ['password', 'deletedAt', 'createdAt', 'updatedAt']
    })

    if (!foundUser) return {}

    return foundUser
  }

  getAllUser = async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
    // parse
    page = Number(page)
    limit = Number(limit)

    const result = await userRepository.findAll({
      limit,
      page,
      unGetFields: ['password', 'deletedAt', 'createdAt', 'updatedAt']
    })
    if (!result) {
      return {
        foundRoles: {},
        page,
        limit,
        total: 0
      }
    }
    const { foundUsers, total } = result
    return {
      foundUsers,
      page,
      limit,
      total
    }
  }

  deleteUserById = async ({ id }: { id: number }) => {
    //soft delete
    const deletedUser = await userRepository.softDelete(id)
    return deletedUser
  }

  restoreUserById = async ({ id }: { id: number }) => {
    const restoreUser = await userRepository.restore(id)
    return restoreUser
  }
}

export const userService = new UserService()
