import { CreateWordBodyReq } from '~/dto/req/word/createWordBody.req'
import { UpdateWordBodyReq } from '~/dto/req/word/updateWordBody.req'
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
}

export const wordService = new WordService()
