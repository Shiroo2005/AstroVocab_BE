import { TopicBody } from '~/dto/req/topic/createTopicBody.req'
import { Word } from '~/entities/word.entity'
import { topicRepository } from '~/repositories/topic.repository'
import { wordService } from './word.service'
import { UpdateTopicBodyReq } from '~/dto/req/topic/updateTopicBody.req'
import { Topic } from '~/entities/topic.entity'
import { topicQueryReq } from '~/dto/req/topic/topicQuery.req'
import { buildFilterLike } from './query.service'
import { DataWithPagination } from '~/dto/res/pagination.res'

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
    const createdTopic = await topicRepository.save(topics)

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

    const updatedTopic = await topicRepository.update(id, {
      title,
      description,
      thumbnail,
      type,
      words
    })

    return updatedTopic
  }

  getTopicById = async ({ id }: { id: number }) => {
    const foundTopic = await topicRepository.findOne(
      { id },
      {
        relations: ['words']
      }
    )

    if (!foundTopic) return {}

    return foundTopic
  }

  isExistTopic = async (id: number) => {
    const foundTopic = await topicRepository.findOne({
      id
    })

    return foundTopic != null
  }

  getAllTopics = async ({ page = 1, limit = 10, description, title, type, sort }: topicQueryReq = {}) => {
    // build where condition

    const where = buildFilterLike({
      likeFields: {
        description,
        title,
        type
      }
    })

    const result = await topicRepository.findAll({
      limit,
      page,
      where,
      order: sort
    })

    const { data, total } = result || { data: [], total: 0 }
    return new DataWithPagination({
      data,
      limit,
      page,
      totalElements: total
    })
  }

  deleteTopicById = async ({ id }: { id: number }) => {
    //soft delete
    const result = await topicRepository.softDelete({
      id
    })

    return result
  }

  restoreTopicController = async ({ id }: { id: number }) => {
    const restoreTopic = await topicRepository.restore({ id })
    return restoreTopic
  }
}

export const topicService = new TopicService()
