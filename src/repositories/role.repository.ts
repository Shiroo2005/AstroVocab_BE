import { IsNull, Not, Repository } from 'typeorm'
import { Role } from '~/entities/role.entity'
import { databaseService } from '~/services/database.service'
import { unGetData } from '~/utils'

export class RoleRepository {
  roleRepo: Repository<Role>

  constructor() {
    this.roleRepo = databaseService.appDataSource.getRepository(Role)
  }

  async findOne({
    conditions,
    unGetFields,
    isDeleted = false
  }: {
    conditions: Partial<Role>
    unGetFields?: string[]
    isDeleted?: boolean
  }) {
    const foundRole = await this.roleRepo.findOne({
      where: {
        ...conditions,
        deletedAt: isDeleted ? Not(IsNull()) : IsNull()
      }
    })

    if (!foundRole) return null
    return unGetData({ fields: unGetFields, object: foundRole })
  }
}

export const roleRepository = new RoleRepository()
