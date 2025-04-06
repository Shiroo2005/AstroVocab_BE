import { CreateWordBodyReq } from '~/dto/req/word/createWordBody.req'
import { wordRepository } from '~/repositories/word.repository'

class WordService {
  createWord = async ({
    content,
    meaning,
    pronunciation,
    audio,
    example,
    image,
    position,
    rank,
    translateExample
  }: CreateWordBodyReq) => {
    const createdWord = await wordRepository.saveOne({
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

    return createdWord
  }
}

export const wordService = new WordService()
