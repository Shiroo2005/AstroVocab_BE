import { FindOptionsWhere, Repository } from 'typeorm'
import { CourseTopic } from '~/entities/courseTopic.entity'

class CourseTopicRepository {
  courseTopicRepo: Repository<CourseTopic>

  constructor() {
    this.init()
  }

  private async init() {
    const { DatabaseService } = await import('~/services/database.service.js')
    this.courseTopicRepo = await DatabaseService.getInstance().getRepository(CourseTopic)
  }

  async delete({ where }: { where: FindOptionsWhere<CourseTopic> }) {
    return await this.courseTopicRepo.delete(where)
  }
}

export const courseTopicRepository = new CourseTopicRepository()
