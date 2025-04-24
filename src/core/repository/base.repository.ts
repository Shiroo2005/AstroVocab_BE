import { FindOptionsWhere, FindOptionsOrder, FindOptionsSelect, ObjectLiteral, Repository, DeepPartial } from 'typeorm'
import { AppDataSource } from '~/services/database.service'

export class BaseRepository<T extends ObjectLiteral> {
  constructor(protected readonly repo: Repository<T>) {}

  async findOne(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    options?: { relations?: string[]; withDeleted?: boolean; select?: FindOptionsSelect<T>; cacheTime?: number }
  ): Promise<T | null> {
    return await this.repo.findOne({
      where,
      relations: options?.relations,
      withDeleted: options?.withDeleted,
      select: options?.select,
      cache: options?.cacheTime || 60000
    })
  }

  async findAll(options: {
    where?: FindOptionsWhere<T> | FindOptionsWhere<T>[]
    page?: number
    limit?: number
    order?: FindOptionsOrder<T>
    relations?: string[]
    select?: FindOptionsSelect<T>
    cacheTime?: number
  }) {
    const { page, limit, where, order, relations, select } = options
    let skip
    if (page && limit) {
      skip = (page - 1) * limit
    }

    const [data, total] = await this.repo.findAndCount({
      where,
      order,
      skip,
      take: limit,
      relations,
      select,
      cache: options.cacheTime || 60000
    })

    return { data, total }
  }

  async save(entity: DeepPartial<T>[] | DeepPartial<T>) {
    const instance = Array.isArray(entity) ? this.repo.create(entity) : this.repo.create([entity])

    return await this.repo.save(instance)
  }

  async insert(entity: DeepPartial<T>) {
    await AppDataSource.createQueryBuilder()
      .insert()
      .into(this.repo.metadata.target)
      .values(entity)
      .updateEntity(false)
      .execute()
  }

  async update(id: number, partial: Partial<T>) {
    return await this.repo.update(id, partial)
  }

  async delete(where: FindOptionsWhere<T>) {
    return await this.repo.delete(where)
  }

  async softDelete(where: FindOptionsWhere<T>) {
    return await this.repo.softDelete(where)
  }

  async restore(where: FindOptionsWhere<T>) {
    return await this.repo.restore(where)
  }

  async count(where?: FindOptionsWhere<T>, { withDeleted = false }: { withDeleted?: boolean } = {}) {
    return await this.repo.count({ where, withDeleted })
  }
  getRepo() {
    return this.repo
  }

  getQueryBuilder(alias?: string) {
    return AppDataSource.getRepository(this.repo.metadata.target).createQueryBuilder(alias)
  }
}
