import { BaseRepository } from '~/core/repository/base.repository'
import { Permission } from '~/entities/permission.entity'
import { getRepository } from '~/services/database.service'

class PermissionRepository extends BaseRepository<Permission> {}

export const permissionRepository = new PermissionRepository(getRepository(Permission))
