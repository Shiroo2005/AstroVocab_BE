import { IsNull, Not, Repository } from 'typeorm'
import { Permission } from '~/entities/permission.entity'
import { Role } from '~/entities/role.entity'
import { User } from '~/entities/user.entity'
import { DatabaseService } from '~/services/database.service'
import { unGetData, unGetDataArray } from '~/utils'
import { validateClass } from '~/utils/validate'

class RoleRepository {
  roleRepo: Repository<Role>

  constructor() {
    this.init()
  }

  private async init() {
    this.roleRepo = await DatabaseService.getInstance().getRepository(Role)
  }

  async findOne({
    conditions,
    unGetFields,
    relations,
    isDeleted = false
  }: {
    conditions: Partial<Role>
    unGetFields?: string[]
    relations?: string[]
    isDeleted?: boolean
  }) {
    const foundRole = await this.roleRepo.findOne({
      where: {
        ...conditions,
        deletedAt: isDeleted ? Not(IsNull()) : IsNull()
      },
      relations
    })

    if (!foundRole) return null
    return unGetData({ fields: unGetFields, object: foundRole })
  }

  async saveOne({ name, permissions, description, users, id }: Role) {
    const role = Role.create({ id, name: name, permissions, description, users })

    //class validator
    await validateClass(role)

    return await this.roleRepo.save(role)
  }

  async findAll({
    limit,
    page,
    conditions,
    unGetFields,
    isDeleted = false
  }: {
    limit: number
    page: number
    conditions?: Partial<Role>
    unGetFields?: string[]
    isDeleted?: boolean
  }) {
    const skip = (page - 1) * limit
    const [foundRoles, total] = await this.roleRepo.findAndCount({
      where: {
        ...conditions,
        deletedAt: isDeleted ? Not(IsNull()) : IsNull()
      },
      skip,
      take: limit
    })

    if (!foundRoles || foundRoles.length === 0) return null
    return {
      foundRoles: unGetDataArray({ fields: unGetFields, objects: foundRoles }),
      total
    }
  }

  async updateOne({
    conditions,
    data,
    isDeleted = false
  }: {
    conditions: Partial<Role>
    data: Partial<Role>
    unGetFields?: string[]
    isDeleted?: boolean
  }) {
    const updatedRole = await this.roleRepo.update(
      {
        ...conditions,
        deletedAt: isDeleted ? Not(IsNull()) : IsNull()
      },
      {
        ...data
      }
    )

    return updatedRole
  }

  async softDelete({ conditions }: { conditions: Partial<Role> }) {
    return await this.roleRepo.softDelete({
      ...conditions
    })
  }

  async count({ conditions = {} }: { conditions?: Partial<Role> }) {
    return await this.roleRepo.findAndCount({
      where: {
        ...conditions
      }
    })
  }
}

export const roleRepository = new RoleRepository()
