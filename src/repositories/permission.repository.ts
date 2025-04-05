import { FindOptionsWhere, IsNull, Not, Repository } from 'typeorm'
import { Permission } from '~/entities/permission.entity'
import { unGetData } from '~/utils'
import { validateClass } from '~/utils/validate'
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
  async saveOne({ action, resource, id }: Permission) {
    const permission = Permission.create({
      id,
      resource,
      action
    })

    //class validator
    await validateClass(permission)

    return await this.permissionRepo.save(permission)
  }

  async findOne({
    where,
    unGetFields,
    relations
  }: {
    where: FindOptionsWhere<Permission> | FindOptionsWhere<Permission>[]
    unGetFields?: string[]
    relations?: string[]
  }) {
    const foundPermission = await this.permissionRepo.findOne({
      where,
      relations
    })

    if (!foundPermission) return null

    return unGetData({ fields: unGetFields, object: foundPermission })
  }

  async softDelete({ where }: { where: FindOptionsWhere<Permission> }) {
    return await this.permissionRepo.softDelete(where)
  }

  async count({ where = {} }: { where?: FindOptionsWhere<Permission> }) {
    return await this.permissionRepo.findAndCount({ where })
  }
}

export const permissionRepository = new PermissionRepository()
