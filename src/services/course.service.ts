import { Topic } from '~/entities/topic.entity'
import { CourseBody } from '~/dto/req/course/createCourseBody.req'
import { Course } from '~/entities/course.entity'
import { topicService } from './topic.service'
import { courseRepository } from '~/repositories/course.repository'
import { UpdateCourseBodyReq } from '~/dto/req/course/updateCourseBody.req'
import { courseQueryReq } from '~/dto/req/course/courseQuery.req'
import { buildFilterLike } from './query.service'
import { DataWithPagination } from '~/dto/res/pagination.res'
import { CourseTopic } from '~/entities/courseTopic.entity'
import { courseTopicRepository } from '~/repositories/courseTopic.repository'

class CourseService {
  createCourse = async (coursesBody: CourseBody[]) => {
    const courses = [] as Course[]

    await Promise.all(
      coursesBody.map(async (course) => {
        const { topics } = course
        const validTopics = [] as CourseTopic[]

        if (topics && topics.length > 0) {
          //filter word id valid
          for (let index = 0; index < topics.length; index++) {
            const topic = topics[index]
            const existTopic = await topicService.isExistTopic(topic.id)

            if (existTopic) {
              validTopics.push({ displayOrder: topic.displayOrder, topic: { id: topic.id } as Topic })
            }
          }
        }

        courses.push({ ...course, courseTopics: validTopics } as Course)
      })
    )

    //save topic into db
    const createdTopic = await courseRepository.saveAll(courses)

    return createdTopic
  }

  updateCourse = async (id: number, { topics, description, level, target, title }: UpdateCourseBodyReq) => {
    //filter topic id valid
    let courseTopics
    if (topics) {
      courseTopics = [] as CourseTopic[]

      // delete course topic before insert new
      await courseTopicRepository.delete({ where: { course: { id } } })

      // create valid courseTopics
      for (const { displayOrder, id: topicId } of topics) {
        const existTopic = await topicService.isExistTopic(topicId)

        if (existTopic) {
          courseTopics.push({ displayOrder: displayOrder, topic: { id: topicId } as Topic })
        }
      }
    }

    const updatedCourse = await courseRepository.updateOne({
      id,
      description,
      level,
      target,
      title,
      courseTopics
    })
    return updatedCourse
  }

  getCourseById = async ({ id }: { id: number }) => {
    const foundCourse = await courseRepository.findOne({
      where: {
        id
      },
      relations: ['courseTopics']
    })

    return foundCourse || {}
  }

  getAllCourses = async ({ page = 1, limit = 10, description, level, target, title, sort }: courseQueryReq = {}) => {
    // build where condition

    const where = buildFilterLike({
      likeFields: {
        description,
        level,
        target,
        title
      }
    })

    const result = await courseRepository.findAll({
      limit,
      page,
      where,
      sort
    })

    const { foundCourses, total } = result || { foundCourses: [], total: 0 }
    return new DataWithPagination({
      data: foundCourses,
      page,
      limit,
      totalElements: total
    })
  }

  deleteCourseById = async ({ id }: { id: number }) => {
    //soft delete
    const result = await courseRepository.softDelete({
      where: {
        id
      }
    })

    return result
  }

  restoreCourseById = async ({ id }: { id: number }) => {
    const restoreCourse = await courseRepository.restore(id)
    return restoreCourse
  }
}

export const courseService = new CourseService()
