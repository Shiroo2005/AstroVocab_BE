import { TopicBody } from '~/dto/req/topic/createTopicBody.req'
import { topicRepository } from '~/repositories/topic.repository'
import { wordService } from './word.service'
import { UpdateTopicBodyReq } from '~/dto/req/topic/updateTopicBody.req'
import { Topic } from '~/entities/topic.entity'
import { topicQueryReq } from '~/dto/req/topic/topicQuery.req'
import { buildFilterLike } from './query.service'
import { DataWithPagination } from '~/dto/res/pagination.res'
import { CompleteTopicBodyReq } from '~/dto/req/topic/completeTopicBody.req'
import { CompletedTopic } from '~/entities/completedTopic.entity'
import { wordProgressService } from './wordProgress.service'
import { AppDataSource } from './database.service'
import { BadRequestError } from '~/core/error.response'
import { WordTopic } from '~/entities/wordTopic.entity'
import { Word } from '~/entities/word.entity'

class TopicService {
  createTopic = async (topicsBody: TopicBody[]) => {
    const topics = [] as Topic[]

    await Promise.all(
      topicsBody.map(async (topic) => {
        const { wordIds } = topic
        const wordTopics = [] as WordTopic[]

        if (wordIds && wordIds.length > 0) {
          //filter word id valid
          for (const id of wordIds) {
            const foundWord = await wordService.getWordById({ id })
            if (foundWord && Object.keys(foundWord).length != 0) {
              wordTopics.push({ word: { id } as Word } as WordTopic)
            }
          }
        }
        topics.push({ ...topic, wordTopics } as Topic)
        console.log(wordTopics)
      })
    )
    //save topic into db
    const createdTopic = await topicRepository.save(topics)

    return createdTopic
  }

  updateTopic = async (id: number, { title, description, thumbnail, type, wordIds }: UpdateTopicBodyReq) => {
    // Xoá word_topic cũ
    await WordTopic.getRepository().softDelete({ topic: { id } })

    //filter word id valid
    let wordTopics
    if (wordIds) {
      wordTopics = []
      //filter word id valid
      for (const wordId of wordIds) {
        const foundWord = await wordService.getWordById({ id: wordId })
        if (foundWord && Object.keys(foundWord).length != 0) {
          wordTopics.push({ word: { id: wordId }, topic: { id } } as WordTopic)
        }
      }

      await WordTopic.save(wordTopics as WordTopic[])
    }

    const foundTopic = (await topicRepository.findOne({ id })) as Topic
    const updateTopic = Topic.update(foundTopic, { title, description, thumbnail, type, wordTopics })

    return await topicRepository.save(updateTopic)
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

  completedTopic = async ({ topicId, userId }: CompleteTopicBodyReq) => {
    //save complete topic into db
    //create word progress

    const queryRunner = AppDataSource.createQueryRunner()

    await queryRunner.startTransaction()
    //start transaction
    try {
      // save complete topic into db
      await queryRunner.manager.getRepository(CompletedTopic).save({ user: { id: userId }, topic: { id: topicId } })

      //create or update word progress record
      const wordsInTopic = await wordService.getAllWordInTopic({ topicId })

      const wordProgress = await wordProgressService.createWordProgress(
        { wordProgress: wordsInTopic, userId },
        queryRunner.manager
      )

      // commit transaction now:
      await queryRunner.commitTransaction()

      return wordProgress
    } catch (err) {
      await queryRunner.rollbackTransaction()
      console.log(`Error when handle topic service: ${err}`)
      throw new BadRequestError(`${err}`)
    } finally {
      // you need to release query runner which is manually created:
      await queryRunner.release()
    }
    //end transaction
  }

  isTopicAlreadyCompleted = async ({ topicId }: { topicId: number }) => {
    return await CompletedTopic.exists({ where: { topic: { id: topicId } } })
  }
}

export const topicService = new TopicService()
