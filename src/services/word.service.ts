import { BadRequestError } from '~/core/error.response'
import { WordBody } from '~/dto/req/word/createWordBody.req'
import { UpdateWordBodyReq } from '~/dto/req/word/updateWordBody.req'
import { wordQueryReq } from '~/dto/req/word/wordQuery.req'
import { DataWithPagination } from '~/dto/res/pagination.res'
import { Word } from '~/entities/word.entity'
import { wordRepository } from '~/repositories/word.repository'
import { buildFilterLike } from './query.service'

class WordService {
  createWords = async (words: WordBody[]) => {
    if (!words || !Array.isArray(words)) throw new BadRequestError('Request body invalid format!')

    const _words = words.map((word) => Word.create(word))

    const result = await wordRepository.save(_words)

    return result
  }

  updateWord = async (
    id: number,
    { content, meaning, pronunciation, audio, example, image, position, rank, translateExample }: UpdateWordBodyReq
  ) => {
    const updateWord = await wordRepository.update(id, {
      content,
      meaning,
      pronunciation,
      audio,
      example,
      image,
      position,
      rank,
      translateExample
    })

    return updateWord
  }

  getWordById = async ({ id }: { id: number }) => {
    const foundWord = await wordRepository.findOne({
      id
    })

    return foundWord || {}
  }

  getAllWords = async ({
    page = 1,
    limit = 10,
    content,
    example,
    meaning,
    position,
    pronunciation,
    rank,
    translateExample,
    sort
  }: wordQueryReq) => {
    //build where condition
    const where = buildFilterLike({
      likeFields: {
        content,
        example,
        meaning,
        position,
        pronunciation,
        rank,
        translateExample
      }
    })

    const result = await wordRepository.findAll({
      limit,
      page,
      where,
      order: sort,
      select: {
        id: true,
        audio: true,
        content: true,
        example: true,
        image: true,
        meaning: true,
        position: true,
        pronunciation: true,
        rank: true,
        translateExample: true
      }
    })

    const { data, total } = result || { data: [], total: 0 }
    return new DataWithPagination({
      data,
      limit,
      page,
      totalElements: total
    })
  }

  deleteWordById = async ({ id }: { id: number }) => {
    //soft delete
    const result = await wordRepository.softDelete({
      id
    })

    return result
  }

  restoreWordById = async ({ id }: { id: number }) => {
    const restoreWord = await wordRepository.restore({ id })
    return restoreWord
  }
}

export const wordService = new WordService()
