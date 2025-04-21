import { BaseRepository } from '~/core/repository/base.repository'
import { CompletedTopic } from '~/entities/completedTopic.entity'
import { Topic } from '~/entities/topic.entity'
import { AppDataSource, getRepository } from '~/services/database.service'

class TopicRepository extends BaseRepository<Topic> {
  getAllCompletedTopicWithCourse = async ({ courseId, userId }: { courseId: number; userId: number }) => {
    const result = AppDataSource.getRepository(CompletedTopic)
      .createQueryBuilder('completedTopic')
      .where('completedTopic.userId = :userId', { userId })
      .leftJoin(
        'course_topic',
        'course_topic',
        'course_topic.topicId = completedTopic.topicId AND course_topic.courseId = :courseId',
        { courseId }
      )
    return await result.getCount()
  }
}

export const topicRepository = new TopicRepository(getRepository(Topic))
