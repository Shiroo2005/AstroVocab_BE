import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm'
import { WordPosition, WordRank } from '~/constants/word'
import { BadRequestError } from '~/core/error.response'
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
    relations,
    withDeleted = false
  }: {
    where: FindOptionsWhere<Word>
    unGetFields?: string[]
    relations?: string[]
    withDeleted?: boolean
  }) {
    const foundRole = await this.wordRepo.findOne({
      where,
      relations,
      withDeleted
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

  async saveAll(words: Word[]) {
    const validWords: Word[] = []

    // push item into array
    for (const word of words) {
      //validate for each item
      await validateClass(word)
      validWords.push(word)
    }

    return await this.wordRepo.save(validWords)
  }

  async findAll({
    limit,
    page,
    where,
    unGetFields,
    order
  }: {
    limit: number
    page: number
    where?: FindOptionsWhere<Word>
    unGetFields?: string[]
    order?: FindOptionsOrder<Word>
  }) {
    const skip = (page - 1) * limit
    const [foundWords, total] = await this.wordRepo.findAndCount({
      where,
      skip,
      take: limit,
      order
    })

    if (!foundWords || foundWords.length === 0) return null
    return {
      foundWords: unGetDataArray({ fields: unGetFields, objects: foundWords }),
      total
    }
  }

  async updateOne({
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
  }: {
    id: number
    content?: string
    pronunciation?: string
    meaning?: string
    position?: WordPosition
    audio?: string
    image?: string
    rank?: WordRank
    example?: string
    translateExample?: string
  }) {
    const foundWord = (await wordRepository.findOne({
      where: {
        id
      }
    })) as Word | null
    if (!foundWord) throw new BadRequestError('Word id not found!')

    const updatedWord = Word.update(foundWord, {
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

    return await this.saveOne(updatedWord)
  }

  async softDelete({ where }: { where: FindOptionsWhere<Word> }) {
    return await this.wordRepo.softDelete(where)
  }

  async count({ where = {} }: { where?: FindOptionsWhere<Word> }) {
    return await this.wordRepo.findAndCount({ where })
  }

  async restore(id: number) {
    return await this.wordRepo.restore({ id })
  }
}

export const wordRepository = new WordRepository()
