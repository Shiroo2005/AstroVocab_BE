import { Topic } from '~/entities/topic.entity'
import { CourseBody } from '~/dto/req/course/createCourseBody.req'
import { Course } from '~/entities/course.entity'
import { topicService } from './topic.service'
import { courseRepository } from '~/repositories/course.repository'
import { UpdateCourseBodyReq } from '~/dto/req/course/updateCourseBody.req'

class CourseService {
  createCourse = async (coursesBody: CourseBody[]) => {
    const courses = [] as Course[]

    await Promise.all(
      coursesBody.map(async (course) => {
        const { topicIds } = course
        const topics = [] as Topic[]

        if (topicIds && topicIds.length > 0) {
          //filter word id valid
          for (const id of topicIds) {
            const existTopic = await topicService.isExistTopic(id)

            if (existTopic) {
              topics.push({ id } as Topic)
            }
          }
        }

        courses.push({ ...course, topics } as Course)
      })
    )

    //save topic into db
    const createdTopic = await courseRepository.saveAll(courses)

    return createdTopic
  }

  updateCourse = async (id: number, { topicIds, description, level, target, title }: UpdateCourseBodyReq) => {
    //filter topic id valid
    let topics
    if (topicIds) {
      topics = []
      for (const id of topicIds) {
        const existTopic = await topicService.isExistTopic(id)

        if (existTopic) {
          topics.push({ id } as Topic)
        }
      }
    }

    const updatedCourse = await courseRepository.updateOne({ id, description, level, target, title, topics })
    return updatedCourse
  }
}

export const courseService = new CourseService()
