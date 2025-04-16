import { BaseRepository } from '~/core/repository/base.repository'
import { User } from '~/entities/user.entity'
import { getRepository } from '~/services/database.service'

class UserRepository extends BaseRepository<User> {}

export const userRepository = new UserRepository(getRepository(User))
