import { BaseRepository } from '~/core/repository/base.repository'
import { Course } from '~/entities/course.entity'
import { CourseTopic } from '~/entities/courseTopic.entity'
import { AppDataSource, getRepository } from '~/services/database.service'

class CourseRepository extends BaseRepository<Course> {
  getAllTopicInCourse = async (courseId: number) => {
    const result = await AppDataSource.getRepository(CourseTopic)
      .createQueryBuilder('courseTopic')
      .where('courseId = :courseId', { courseId })
      .getCount()
    return result
  }
}
export const courseRepository = new CourseRepository(getRepository(Course))
