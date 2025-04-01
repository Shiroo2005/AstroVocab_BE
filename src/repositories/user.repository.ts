import { FindOptionsWhere, IsNull, Not, Repository } from 'typeorm'
import { User } from '~/entities/user.entity'
import { unGetData } from '~/utils'
import { validateClass } from '~/utils/validate'

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
    relations,
    isDeleted = false
  }: {
    where: FindOptionsWhere<User> | FindOptionsWhere<User>[]
    unGetFields?: string[]
    relations?: string[]
    isDeleted?: boolean
  }) {
    const foundUser = await this.userRepo.findOne({
      where: Array.isArray(where)
        ? where.map((w) => ({ ...w, deletedAt: isDeleted ? Not(IsNull()) : IsNull() }))
        : { ...where, deletedAt: isDeleted ? Not(IsNull()) : IsNull() },
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

  async findAll({
    where,
    unGetFields,
    relations,
    isDeleted = false
  }: {
    where: FindOptionsWhere<User> | FindOptionsWhere<User>[]
    unGetFields?: string[]
    relations?: string[]
    isDeleted?: boolean
  }) {
    const foundUsers = await this.userRepo.find({
      where: Array.isArray(where)
        ? where.map((w) => ({ ...w, deletedAt: isDeleted ? Not(IsNull()) : IsNull() }))
        : { ...where, deletedAt: isDeleted ? Not(IsNull()) : IsNull() },
      relations
    })

    if (!foundUsers || foundUsers.length === 0) return null

    return unGetData({ fields: unGetFields, object: foundUsers })
  }

  async count({ where = {} }: { where?: FindOptionsWhere<User> }) {
    return await this.userRepo.findAndCount({
      where
    })
  }
}

export const userRepository = new UserRepository()
