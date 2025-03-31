import { IsNull, Not, Repository } from 'typeorm'
import { User } from '~/entities/user.entity'
import { databaseService } from '~/services/database.service'
import { unGetData } from '~/utils'

class UserRepository {
  userRepo: Repository<User>

  constructor() {
    this.userRepo = databaseService.appDataSource.getRepository(User)
  }

  async findOne({
    conditions,
    unGetFields,
    relations,
    isDeleted = false
  }: {
    conditions: Partial<User>
    unGetFields?: string[]
    relations?: string[]
    isDeleted?: boolean
  }) {
    const foundUser = await this.userRepo.findOne({
      where: {
        ...conditions,
        deletedAt: isDeleted ? Not(IsNull()) : IsNull()
      },
      relations
    })

    if (!foundUser) return null

    return unGetData({ fields: unGetFields, object: foundUser })
  }

  async saveOne({ email, username, password, fullName, avatar, status, role, tokens }: Partial<User>) {
    return await this.userRepo.save({
      email,
      username,
      password,
      fullName,
      avatar,
      status,
      role,
      tokens
    })
  }
}

export const userRepository = new UserRepository()
