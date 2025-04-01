import { FindOptionsWhere, IsNull, Not, Repository } from 'typeorm'
import { Permission } from '~/entities/permission.entity'
import { unGetData } from '~/utils'
console.log('PermissionRepository loaded')

class PermissionRepository {
  permissionRepo: Repository<Permission>

  constructor() {
    this.init()
  }

  private async init() {
    const { DatabaseService } = await import('~/services/database.service.js')
    this.permissionRepo = await DatabaseService.getInstance().getRepository(Permission)
  }
  // constructor() {
  //   console.log('PermissionRepository loaded')
  //   this.permissionRepo = DatabaseService.getInstance().getRepository(Permission)
  // }
  async saveOne({ action, resource }: Permission) {
    return await this.permissionRepo.save({
      action,
      resource
    })
  }

  async findOne({
    where,
    unGetFields,
    relations,
    isDeleted = false
  }: {
    where: FindOptionsWhere<Permission> | FindOptionsWhere<Permission>[]
    unGetFields?: string[]
    relations?: string[]
    isDeleted?: boolean
  }) {
    const foundPermission = await this.permissionRepo.findOne({
      where: Array.isArray(where)
        ? where.map((w) => ({ ...w, deletedAt: isDeleted ? Not(IsNull()) : IsNull() }))
        : { ...where, deletedAt: isDeleted ? Not(IsNull()) : IsNull() },
      relations
    })

    if (!foundPermission) return null

    return unGetData({ fields: unGetFields, object: foundPermission })
  }

  async softDelete({ conditions }: { conditions: Partial<Permission> }) {
    return await this.permissionRepo.softDelete({
      ...conditions
    })
  }

  async count({ conditions = {} }: { conditions?: Partial<Permission> }) {
    return await this.permissionRepo.findAndCount({
      where: {
        ...conditions
      }
    })
  }
}

export const permissionRepository = new PermissionRepository()
