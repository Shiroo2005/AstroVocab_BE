import { CreateTopicBodyReq } from '~/dto/req/topic/createTopicBody.req'
import { Word } from '~/entities/word.entity'
import { topicRepository } from '~/repositories/topic.repository'
import { wordService } from './word.service'
import { UpdateTopicBodyReq } from '~/dto/req/topic/updateTopicBody.req'

class TopicService {
  createTopic = async ({ title, description, thumbnail, type, wordIds }: CreateTopicBodyReq) => {
    const words = [] as Word[]

    if (wordIds && wordIds.length > 0) {
      //filter word id valid
      for (const id of wordIds) {
        const foundWord = await wordService.getWordById({ id })
        if (foundWord && Object.keys(foundWord).length != 0) {
          words.push({ id } as Word)
        }
        console.log(foundWord, Object.keys(foundWord))
      }
    }

    const createdTopic = await topicRepository.saveOne({
      title,
      thumbnail,
      description,
      type,
      words
    })

    return createdTopic
  }

  updateTopic = async (id: number, { title, description, thumbnail, type, wordIds }: UpdateTopicBodyReq) => {
    const words = [] as Word[]

    if (wordIds && wordIds.length > 0) {
      //filter word id valid
      for (const id of wordIds) {
        const foundWord = await wordService.getWordById({ id })
        if (foundWord && Object.keys(foundWord).length != 0) {
          words.push({ id } as Word)
        }
        console.log(foundWord, Object.keys(foundWord))
      }
    }

    const updatedTopic = await topicRepository.updateOne({
      title,
      description,
      thumbnail,
      type,
      words,
      id
    })

    return updatedTopic
  }
}

export const topicService = new TopicService()
