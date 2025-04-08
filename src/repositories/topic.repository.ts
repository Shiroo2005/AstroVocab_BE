import { FindOptionsWhere, Repository } from 'typeorm'
import { TopicType } from '~/constants/topic'
import { BadRequestError } from '~/core/error.response'
import { Token } from '~/entities/token.entity'
import { Topic } from '~/entities/topic.entity'
import { Word } from '~/entities/word.entity'
import { unGetData } from '~/utils'
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
    unGetFields,
    relations
  }: {
    where: FindOptionsWhere<Token> | FindOptionsWhere<Token>[]
    unGetFields?: string[]
    relations?: string[]
  }) {
    const foundUser = await this.topicRepo.findOne({
      where,
      relations
    })

    if (!foundUser) return null

    return unGetData({ fields: unGetFields, object: foundUser })
  }

  async hardDelete({ conditions }: { conditions: Partial<Token> }) {
    return await this.topicRepo.delete({
      ...conditions
    })
  }
}

export const topicRepository = new TopicRepository()
