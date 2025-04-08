import { TopicBody } from '~/dto/req/topic/createTopicBody.req'
import { Word } from '~/entities/word.entity'
import { topicRepository } from '~/repositories/topic.repository'
import { wordService } from './word.service'
import { UpdateTopicBodyReq } from '~/dto/req/topic/updateTopicBody.req'
import { Topic } from '~/entities/topic.entity'
import { promisify } from 'util'

class TopicService {
  createTopic = async (topicsBody: TopicBody[]) => {
    const topics = [] as Topic[]

    await Promise.all(
      topicsBody.map(async (topic) => {
        const { wordIds } = topic
        const words = [] as Word[]

        if (wordIds && wordIds.length > 0) {
          //filter word id valid
          for (const id of wordIds) {
            const foundWord = await wordService.getWordById({ id })
            if (foundWord && Object.keys(foundWord).length != 0) {
              words.push({ id } as Word)
            }
          }
        }
        topics.push({ ...topic, words } as Topic)
      })
    )

    //save topic into db
    const createdTopic = await topicRepository.saveAll(topics)

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
