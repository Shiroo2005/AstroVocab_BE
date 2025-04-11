import { Topic } from '~/entities/topic.entity'
import { CourseBody } from '~/dto/req/course/createCourseBody.req'
import { Course } from '~/entities/course.entity'
import { topicService } from './topic.service'
import { courseRepository } from '~/repositories/course.repository'
import { UpdateCourseBodyReq } from '~/dto/req/course/updateCourseBody.req'
import { toNumber } from 'lodash'

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

  getCourseById = async ({ id }: { id: number }) => {
    const foundCourse = await courseRepository.findOne({
      where: {
        id
      },
      relations: ['topics']
    })

    return foundCourse || {}
  }

  getAllCourses = async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
    // parse page limit
    page = toNumber(page)
    limit = toNumber(limit)

    const result = await courseRepository.findAll({
      limit,
      page
    })

    const { foundCourses, total } = result || { foundCourses: [], total: 0 }
    return {
      foundCourses,
      page,
      limit,
      total
    }
  }
}

export const courseService = new CourseService()
