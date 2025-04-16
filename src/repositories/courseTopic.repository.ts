import { BaseRepository } from '~/core/repository/base.repository'
import { CourseTopic } from '~/entities/courseTopic.entity'
import { getRepository } from '~/services/database.service'

class CourseTopicRepository extends BaseRepository<CourseTopic> {}

export const courseTopicRepository = new CourseTopicRepository(getRepository(CourseTopic))
