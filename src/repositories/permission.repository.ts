import { BaseRepository } from '~/core/repository/base.repository'
import { Permission } from '~/entities/permission.entity'
import { getRepository } from '~/services/database.service'

class PermissionRepository extends BaseRepository<Permission> {
  findByRole = ({
    roleId,
    selectFields = ['permission.action', 'permission.resource']
  }: {
    roleId: number
    selectFields?: string[]
  }) => {
    return permissionRepository
      .getQueryBuilder('permission')
      .leftJoin('role_permission', 'role_permission', 'role_permission.permissionId = permission.id')
      .where('role_permission.roleId = :roleId', { roleId })
      .select(selectFields)
      .cache('permisison_by_role', 900000)
  }
}

export const permissionRepository = new PermissionRepository(getRepository(Permission))
