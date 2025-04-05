import { FindOptionsWhere, Repository } from 'typeorm'
import { Role } from '~/entities/role.entity'
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
    where,
    unGetFields,
    relations
  }: {
    where: FindOptionsWhere<Role>
    unGetFields?: string[]
    relations?: string[]
  }) {
    const foundRole = await this.roleRepo.findOne({
      where,
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
    where,
    unGetFields
  }: {
    limit: number
    page: number
    where?: FindOptionsWhere<Role>
    unGetFields?: string[]
  }) {
    const skip = (page - 1) * limit
    const [foundRoles, total] = await this.roleRepo.findAndCount({
      where,
      skip,
      take: limit
    })

    if (!foundRoles || foundRoles.length === 0) return null
    return {
      foundRoles: unGetDataArray({ fields: unGetFields, objects: foundRoles }),
      total
    }
  }

  async updateOne({ where, data }: { where: FindOptionsWhere<Role>; data: Partial<Role>; unGetFields?: string[] }) {
    const updatedRole = await this.roleRepo.update(where, {
      ...data
    })

    return updatedRole
  }

  async softDelete({ where }: { where: FindOptionsWhere<Role> }) {
    return await this.roleRepo.softDelete(where)
  }

  async count({ where = {} }: { where?: FindOptionsWhere<Role> }) {
    return await this.roleRepo.findAndCount({ where })
  }
}

export const roleRepository = new RoleRepository()
