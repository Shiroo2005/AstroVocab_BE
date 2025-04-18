import { toNumber } from 'lodash'
import { Like } from 'typeorm'
import { CreateUserBodyReq } from '~/dto/req/user/createUserBody.req'
import { userQueryReq } from '~/dto/req/user/userQuery.req'
import { UpdateUserBodyReq } from '~/dto/req/user/updateUserBody.req'
import { DataWithPagination } from '~/dto/res/pagination.res'
import { Role } from '~/entities/role.entity'
import { userRepository } from '~/repositories/user.repository'
import { unGetData } from '~/utils'

class UserService {
  createUser = async ({ email, username, avatar, fullName, password, roleId }: CreateUserBodyReq) => {
    //save user in db
    const role = { id: roleId } as Role

    const createdUser = await userRepository.save({ email, username, avatar, fullName, password, role })

    return unGetData({ fields: ['password'], object: createdUser })
  }

  updateUser = async (id: number, { email, username, fullName, roleId, avatar, status }: UpdateUserBodyReq) => {
    const updatedUser = await userRepository.update(id, {
      email,
      username,
      fullName,
      avatar,
      status,
      role: { id: roleId } as Role
    })

    return unGetData({ fields: ['password'], object: updatedUser })
  }

  getUserById = async (id: number) => {
    const foundUser = await userRepository.findOne(
      { id },
      {
        select: {
          id: true,
          username: true,
          avatar: true,
          email: true,
          fullName: true,
          role: { name: true },
          status: true
        }
      }
    )

    if (!foundUser) return {}

    return foundUser
  }

  getAllUsers = async ({ page = 1, limit = 10, email, fullName, roleName, sort, status, username }: userQueryReq) => {
    //parse page
    page = toNumber(page)
    limit = toNumber(limit)

    //build filter to where condition
    const where = this.buildUserFilters({ email, fullName, roleName, status, username })

    //find user with condition
    const result = await userRepository.findAll({
      limit,
      page,
      where,
      relations: ['role'],
      order: sort,
      select: {
        id: true,
        username: true,
        avatar: true,
        email: true,
        fullName: true,
        role: { name: true },
        status: true
      }
    })

    const { data, total } = result || { data: [], total: 0 }
    return new DataWithPagination({ data, limit, page, totalElements: total })
  }

  deleteUserById = async ({ id }: { id: number }) => {
    //soft delete
    const deletedUser = await userRepository.softDelete({ id })
    return deletedUser
  }

  restoreUserById = async ({ id }: { id: number }) => {
    const restoreUser = await userRepository.restore({ id })
    return restoreUser
  }

  buildUserFilters = ({ email, fullName, username, roleName, status }: userQueryReq) => {
    const filters: any = {}

    if (email) filters.email = Like(`%${email}%`)
    if (fullName) filters.fullName = Like(`%${fullName}%`)
    if (username) filters.username = Like(`%${username}%`)
    if (status) filters.status = status

    if (roleName) {
      filters.role = { name: Like(`%${roleName}%`) }
    }

    return filters
  }
}

export const userService = new UserService()
