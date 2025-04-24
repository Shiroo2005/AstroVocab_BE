import { BaseRepository } from '~/core/repository/base.repository'
import { User } from '~/entities/user.entity'
import { AppDataSource, getRepository } from '~/services/database.service'

class UserRepository extends BaseRepository<User> {
  findUserAndJoinRole = ({ selectFields }: { selectFields: string[] }) => {
    return AppDataSource.getRepository(User)
      .createQueryBuilder('user')
      .select(selectFields)
      .leftJoin('user.role', 'role')
  }
}

export const userRepository = new UserRepository(getRepository(User))
