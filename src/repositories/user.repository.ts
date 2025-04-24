import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js'
import { BaseRepository } from '~/core/repository/base.repository'
import { User } from '~/entities/user.entity'
import { AppDataSource, getRepository } from '~/services/database.service'

class UserRepository extends BaseRepository<User> {
  findUserAndJoinRole = ({
    selectFields = [
      'user.id',
      'user.username',
      'user.email',
      'user.status',
      'user.avatar',
      'user.fullName',
      'user.lastStudyDate',
      'user.streak',
      'user.totalStudyDay',
      'role.id',
      'role.name'
    ]
  }: {
    selectFields?: string[]
  } = {}) => {
    return AppDataSource.getRepository(User)
      .createQueryBuilder('user')
      .select(selectFields)
      .leftJoin('user.role', 'role')
  }

  saveOne = async (values: QueryDeepPartialEntity<User>) => {
    return await this.getQueryBuilder().insert().into(User).values(values).execute()
  }

  findUserById = ({
    id,
    selectFields = [
      'user.id',
      'user.username',
      'user.email',
      'user.status',
      'user.avatar',
      'user.fullName',
      'user.lastStudyDate',
      'user.streak',
      'user.totalStudyDay',
      'role.id',
      'role.name'
    ]
  }: {
    id: number
    selectFields?: string[]
  }) => {
    return AppDataSource.getRepository(User).createQueryBuilder('user').select(selectFields).where('id = :id', { id })
  }
}

export const userRepository = new UserRepository(getRepository(User))
