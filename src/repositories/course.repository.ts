import { BaseRepository } from '~/core/repository/base.repository'
import { Course } from '~/entities/course.entity'
import { getRepository } from '~/services/database.service'

class CourseRepository extends BaseRepository<Course> {}
export const courseRepository = new CourseRepository(getRepository(Course))
