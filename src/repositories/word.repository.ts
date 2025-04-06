import { FindOptionsWhere, Repository } from 'typeorm'
import { Word } from '~/entities/word.entity'
import { DatabaseService } from '~/services/database.service'
import { unGetData, unGetDataArray } from '~/utils'
import { validateClass } from '~/utils/validate'

class WordRepository {
  wordRepo: Repository<Word>

  constructor() {
    this.init()
  }

  private async init() {
    this.wordRepo = await DatabaseService.getInstance().getRepository(Word)
  }

  async findOne({
    where,
    unGetFields,
    relations
  }: {
    where: FindOptionsWhere<Word>
    unGetFields?: string[]
    relations?: string[]
  }) {
    const foundRole = await this.wordRepo.findOne({
      where,
      relations
    })

    if (!foundRole) return null
    return unGetData({ fields: unGetFields, object: foundRole })
  }

  async saveOne({
    id,
    content,
    meaning,
    pronunciation,
    audio,
    image,
    rank,
    position,
    example,
    translateExample
  }: Word) {
    const word = Word.create({
      id,
      content,
      meaning,
      pronunciation,
      audio,
      image,
      rank,
      position,
      example,
      translateExample
    })

    //class validator
    await validateClass(word)

    return await this.wordRepo.save(word)
  }

  //   async findAll({
  //     limit,
  //     page,
  //     where,
  //     unGetFields
  //   }: {
  //     limit: number
  //     page: number
  //     where?: FindOptionsWhere<Role>
  //     unGetFields?: string[]
  //   }) {
  //     const skip = (page - 1) * limit
  //     const [foundRoles, total] = await this.wordRepo.findAndCount({
  //       where,
  //       skip,
  //       take: limit
  //     })

  //     if (!foundRoles || foundRoles.length === 0) return null
  //     return {
  //       foundRoles: unGetDataArray({ fields: unGetFields, objects: foundRoles }),
  //       total
  //     }
  //   }

  async updateOne({ where, data }: { where: FindOptionsWhere<Word>; data: Partial<Word>; unGetFields?: string[] }) {
    const updatedRole = await this.wordRepo.update(where, {
      ...data
    })

    return updatedRole
  }

  async softDelete({ where }: { where: FindOptionsWhere<Word> }) {
    return await this.wordRepo.softDelete(where)
  }

  async count({ where = {} }: { where?: FindOptionsWhere<Word> }) {
    return await this.wordRepo.findAndCount({ where })
  }
}

export const wordRepository = new WordRepository()
