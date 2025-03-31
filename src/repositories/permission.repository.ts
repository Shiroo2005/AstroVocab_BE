import { IsNull, Not, Repository } from 'typeorm'
import { Permission } from '~/entities/permission.entity'
import { databaseService } from '~/services/database.service'
import { unGetData } from '~/utils'

class PermissionRepository {
  permissionRepo: Repository<Permission>

  constructor() {
    this.permissionRepo = databaseService.appDataSource.getRepository(Permission)
  }
  create = async (permission: Permission) => {
    const createdPermission = await this.permissionRepo.create(permission)
    return createdPermission
  }

  async findOne({
    conditions,
    unGetFields,
    relations,
    isDeleted = false
  }: {
    conditions: Partial<Permission>
    unGetFields?: string[]
    relations?: string[]
    isDeleted?: boolean
  }) {
    const foundPermission = await this.permissionRepo.findOne({
      where: {
        ...conditions,
        deletedAt: isDeleted ? Not(IsNull()) : IsNull()
      },
      relations
    })

    if (!foundPermission) return null

    return unGetData({ fields: unGetFields, object: foundPermission })
  }
}

export const permissionRepository = new PermissionRepository()
