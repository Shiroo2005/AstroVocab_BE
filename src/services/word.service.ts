import { BadRequestError } from '~/core/error.response'
import { CreateWordBodyReq } from '~/dto/req/word/createWordBody.req'
import { UpdateWordBodyReq } from '~/dto/req/word/updateWordBody.req'
import { Word } from '~/entities/word.entity'
import { wordRepository } from '~/repositories/word.repository'

class WordService {
  createWords = async (words: CreateWordBodyReq[]) => {
    console.log(words)

    if (!words || !Array.isArray(words)) throw new BadRequestError('Request body invalid format!')

    const _words = words.map((word) => Word.create(word))

    const result = await wordRepository.saveAll(_words)

    return result
  }

  updateWord = async (
    id: number,
    { content, meaning, pronunciation, audio, example, image, position, rank, translateExample }: UpdateWordBodyReq
  ) => {
    const updateWord = await wordRepository.updateOne({
      id,
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
      where: {
        id
      }
    })

    return foundWord || {}
  }

  getAllWords = async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
    const result = await wordRepository.findAll({
      limit,
      page
    })

    if (!result) {
      return {
        foundWords: [],
        page,
        limit,
        total: 0
      }
    }
    const { foundWords, total } = result
    return {
      foundWords,
      page,
      limit,
      total
    }
  }

  deleteWordById = async ({ id }: { id: number }) => {
    //soft delete
    const result = await wordRepository.softDelete({
      where: {
        id
      }
    })

    return result
  }

  restoreWordById = async ({ id }: { id: number }) => {
    const restoreWord = await wordRepository.restore(id)
    return restoreWord
  }
}

export const wordService = new WordService()
