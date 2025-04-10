import { TopicBody } from '~/dto/req/topic/createTopicBody.req'
import { Word } from '~/entities/word.entity'
import { topicRepository } from '~/repositories/topic.repository'
import { wordService } from './word.service'
import { UpdateTopicBodyReq } from '~/dto/req/topic/updateTopicBody.req'
import { Topic } from '~/entities/topic.entity'

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
    //filter word id valid
    let words
    if (wordIds) {
      words = []
      //filter word id valid
      for (const id of wordIds) {
        const foundWord = await wordService.getWordById({ id })
        if (foundWord && Object.keys(foundWord).length != 0) {
          words.push({ id } as Word)
        }
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

  getTopicById = async ({ id }: { id: number }) => {
    const foundTopic = await topicRepository.findOne({
      where: {
        id
      },
      relations: ['words']
    })

    if (!foundTopic) return {}

    return foundTopic
  }

  isExistTopic = async (id: number) => {
    const foundTopic = await topicRepository.findOne({
      where: {
        id
      }
    })

    return foundTopic != null
  }

  getAllTopics = async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
    const result = await topicRepository.findAll({
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
    const { foundTopics, total } = result
    return {
      foundTopics,
      page,
      limit,
      total
    }
  }

  deleteTopicById = async ({ id }: { id: number }) => {
    //soft delete
    const result = await topicRepository.softDelete({
      where: {
        id
      }
    })

    return result
  }

  restoreTopicById = async ({ id }: { id: number }) => {
    const restoreWord = await topicRepository.restore(id)
    return restoreWord
  }
}

export const topicService = new TopicService()
