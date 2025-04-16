import { BaseRepository } from '~/core/repository/base.repository'
import { Role } from '~/entities/role.entity'
import { getRepository } from '~/services/database.service'

class RoleRepository extends BaseRepository<Role> {}

export const roleRepository = new RoleRepository(getRepository(Role))
