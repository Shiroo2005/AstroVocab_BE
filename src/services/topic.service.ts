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
import { In } from 'typeorm'

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
        topics.push({ ...topic, wordTopics, version: 1 } as Topic)
        console.log(wordTopics)
      })
    )
    //save topic into db
    const createdTopic = await topicRepository.save(topics)

    return createdTopic
  }

  updateTopic = async (id: number, { title, description, thumbnail, type, wordIds }: UpdateTopicBodyReq) => {
    const topic = await topicRepository.findOne({ id }, { relations: ['wordTopics', 'wordTopics.word'] })
    if (!topic) return {}

    if (wordIds) {
      //get old word list
      const oldWordIds = topic.wordTopics?.map((wt) => wt.word?.id) as number[]

      //new word list
      const newWordIds = wordIds ?? []

      const toDelete = oldWordIds.filter((id) => !newWordIds.includes(id))
      const toInsert = newWordIds.filter((id) => !oldWordIds.includes(id))

      // Xoá wordTopic cũ
      if (toDelete.length > 0) {
        await WordTopic.delete({
          topic: { id },
          word: In(toDelete)
        })
      }

      // Thêm mới
      const newWordTopics = toInsert.map((wordId) => ({
        topic: { id },
        word: { id: wordId }
      }))

      //save if new
      if (newWordTopics.length > 0) {
        topic.wordTopics = WordTopic.create(newWordTopics)
      }

      // Increase version if has change in word list
      if (toDelete.length > 0 || toInsert.length > 0) {
        topic.version++
      }
    }

    // Update topic info
    if (title) topic.title = title
    if (description) topic.description = description
    if (thumbnail) topic.thumbnail = thumbnail
    if (type) topic.type = type

    return await topicRepository.save(topic)
  }

  getTopicById = async ({ id }: { id: number }) => {
    const foundTopic = await topicRepository.findOne(
      { id },
      {
        relations: ['wordTopics', 'wordTopics.word']
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

  completedTopic = async ({ topic, userId }: CompleteTopicBodyReq) => {
    //save complete topic into db
    //create word progress

    const queryRunner = AppDataSource.createQueryRunner()

    await queryRunner.startTransaction()
    //start transaction
    try {
      const topicId = topic.id as number
      // save complete topic into db
      await queryRunner.manager
        .getRepository(CompletedTopic)
        .save({ user: { id: userId }, topic: { id: topicId }, topicVersionAtCompletion: topic.version })

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
