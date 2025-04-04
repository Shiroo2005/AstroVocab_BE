import { FindOptionsWhere, Repository } from 'typeorm'
import { UserStatus } from '~/constants/userStatus'
import { BadRequestError } from '~/core/error.response'
import { Role } from '~/entities/role.entity'
import { User } from '~/entities/user.entity'
import { unGetData, unGetDataArray } from '~/utils'
import { validateClass } from '~/utils/validate'
import { tokenRepository } from './token.repository'

class UserRepository {
  userRepo: Repository<User>

  constructor() {
    this.init()
  }

  private async init() {
    const { DatabaseService } = await import('~/services/database.service.js')
    this.userRepo = await DatabaseService.getInstance().getRepository(User)
  }

  async findOne({
    where,
    unGetFields,
    relations
  }: {
    where: FindOptionsWhere<User> | FindOptionsWhere<User>[]
    unGetFields?: string[]
    relations?: string[]
  }) {
    const foundUser = await this.userRepo.findOne({
      where,
      relations
    })

    if (!foundUser) return null

    return unGetData({ fields: unGetFields, object: foundUser })
  }

  async saveOne({ id, email, username, password, fullName, avatar, status, role, tokens }: User) {
    const user = User.create({
      id,
      email: email,
      username: username,
      password: password,
      fullName: fullName,
      avatar,
      status,
      role,
      tokens
    })

    // class validate
    await validateClass(user)

    return await this.userRepo.save(user)
  }

  async updateOne({
    id,
    email,
    username,
    fullName,
    avatar,
    status,
    roleId
  }: {
    id: number
    email?: string
    username?: string
    fullName?: string
    avatar?: string
    status?: UserStatus
    roleId?: number
  }) {
    const foundUser = (await this.findOne({ where: { id } })) as User | null

    if (!foundUser) throw new BadRequestError('User id not found!')

    const _foundUser = User.update(foundUser, {
      email,
      username,
      fullName,
      avatar,
      status,
      role: { id: roleId } as Role
    })

    return await this.userRepo.save(_foundUser)
  }

  async findAll({
    limit = 10,
    page = 1,
    where,
    relations,
    unGetFields
  }: {
    limit?: number
    page?: number
    where?: FindOptionsWhere<User> | FindOptionsWhere<User>[]
    unGetFields?: string[]
    relations?: string[]
  }) {
    const skip = (page - 1) * limit
    const [foundUsers, total] = await this.userRepo.findAndCount({
      where,
      relations,
      skip,
      take: limit
    })

    if (!foundUsers || foundUsers.length === 0) return null

    return {
      foundUsers: unGetDataArray({ fields: unGetFields, objects: foundUsers }),
      total
    }
  }

  async count({ where = {} }: { where?: FindOptionsWhere<User> }) {
    return await this.userRepo.findAndCount({
      where
    })
  }

  async softDelete(id: number, { conditions }: { conditions?: Partial<User> } = {}) {
    // delete token user has
    await tokenRepository.hardDelete({
      conditions: {
        user: {
          id
        } as User
      }
    })

    return await this.userRepo.softDelete({
      ...conditions,
      id
    })
  }

  async restore(id: number) {
    return await this.userRepo.restore({ id })
  }
}

export const userRepository = new UserRepository()
