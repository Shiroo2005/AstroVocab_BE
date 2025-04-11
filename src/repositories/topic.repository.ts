import { FindOptionsWhere, Repository } from 'typeorm'
import { TopicType } from '~/constants/topic'
import { BadRequestError } from '~/core/error.response'
import { Topic } from '~/entities/topic.entity'
import { Word } from '~/entities/word.entity'
import { unGetData, unGetDataArray } from '~/utils'
import { validateClass } from '~/utils/validate'

class TopicRepository {
  topicRepo: Repository<Topic>

  constructor() {
    this.init()
  }

  private async init() {
    const { DatabaseService } = await import('~/services/database.service.js')
    this.topicRepo = await DatabaseService.getInstance().getRepository(Topic)
  }

  async saveOne({ title, description, thumbnail, type, words, id }: Topic) {
    const topic = Topic.create({ title, description, thumbnail, type, words, id })
    //class validator
    await validateClass(topic)

    return await this.topicRepo.save(topic)
  }

  async saveAll(topics: Topic[]) {
    const validTopics = []
    for (const _topic of topics) {
      const topic = Topic.create(_topic)
      //class validator
      await validateClass(topic)
      validTopics.push(topic)
    }

    return await this.topicRepo.save(validTopics)
  }

  async updateOne({
    title,
    description,
    thumbnail,
    type,
    words,
    id
  }: {
    title?: string
    description?: string
    thumbnail?: string
    type?: TopicType
    words?: Word[]
    id: number
  }) {
    const foundTopic = (await topicRepository.findOne({
      where: {
        id
      }
    })) as Topic | null
    if (!foundTopic) throw new BadRequestError('Topic id not found!')

    const updateTopic = Topic.update(foundTopic, {
      title,
      description,
      thumbnail,
      type,
      words
    })

    return await this.saveOne(updateTopic)
  }

  async findOne({
    where,
    unGetFields = ['deletedAt', 'createdAt', 'updatedAt'],
    relations
  }: {
    where: FindOptionsWhere<Topic> | FindOptionsWhere<Topic>[]
    unGetFields?: string[]
    relations?: string[]
  }) {
    const foundTopic = await this.topicRepo.findOne({
      where,
      relations
    })

    if (!foundTopic) return null

    return unGetData({ fields: unGetFields, object: foundTopic })
  }

  async findAll({
    limit,
    page,
    where,
    unGetFields
  }: {
    limit: number
    page: number
    where?: FindOptionsWhere<Topic>
    unGetFields?: string[]
  }) {
    const skip = (page - 1) * limit
    const [foundTopics, total] = await this.topicRepo.findAndCount({
      where,
      skip,
      take: limit
    })

    if (!foundTopics || foundTopics.length === 0) return null
    return {
      foundTopics: unGetDataArray({ fields: unGetFields, objects: foundTopics }),
      total
    }
  }

  async softDelete({ where }: { where: FindOptionsWhere<Topic> }) {
    return await this.topicRepo.softDelete(where)
  }

  async restore(id: number) {
    return await this.topicRepo.restore({ id })
  }
}

export const topicRepository = new TopicRepository()
