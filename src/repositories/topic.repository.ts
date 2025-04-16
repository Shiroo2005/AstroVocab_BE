import { BaseRepository } from '~/core/repository/base.repository'
import { Topic } from '~/entities/topic.entity'
import { getRepository } from '~/services/database.service'

class TopicRepository extends BaseRepository<Topic> {}

export const topicRepository = new TopicRepository(getRepository(Topic))
