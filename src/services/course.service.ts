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
import { EntityManager } from 'typeorm'

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
    const createdTopic = await courseRepository.save(courses)

    return createdTopic
  }

  updateCourse = async (id: number, { topics, description, level, target, title }: UpdateCourseBodyReq) => {
    //filter topic id valid
    let courseTopics
    if (topics) {
      courseTopics = [] as CourseTopic[]

      // delete course topic before insert new
      await courseTopicRepository.delete({ course: { id } })

      // create valid courseTopics
      for (const { displayOrder, id: topicId } of topics) {
        const existTopic = await topicService.isExistTopic(topicId)

        if (existTopic) {
          courseTopics.push({ displayOrder: displayOrder, topic: { id: topicId } as Topic })
        }
      }
    }

    const updatedCourse = await courseRepository.update(id, {
      description,
      level,
      target,
      title,
      courseTopics
    })
    return updatedCourse
  }

  getCourseById = async ({ id }: { id: number }) => {
    const foundCourse = await courseRepository.findOne(
      { id },
      {
        relations: ['courseTopics']
      }
    )

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
      order: sort
    })

    const { data, total } = result || { data: [], total: 0 }
    return new DataWithPagination({
      data,
      page,
      limit,
      totalElements: total
    })
  }

  deleteCourseById = async ({ id }: { id: number }) => {
    //soft delete
    const result = await courseRepository.softDelete({ id })

    return result
  }

  restoreCourseById = async ({ id }: { id: number }) => {
    const restoreCourse = await courseRepository.restore({ id })
    return restoreCourse
  }

  // updateCourseProgress = async ({ courseId, userId }: { courseId: number; userId: number }, manager: EntityManager) => {
  //   const courseProgressRepo = manager.getRepository(CourseProgress)

  //   //check if course progress for this user was create before ?
  //   const courseProgress = await courseProgressRepo.findOne({
  //     where: { user: { id: userId }, course: { id: courseId } }
  //   })

  //   let topicDone: number
  //   let courseSize: number

  //   //was not created
  //   if (!courseProgress) {
  //     //get course size
  //     //newProgress = topicDone = 1 / courseSize
  //     //create new courseProgress

  //     topicDone = 1
  //     //get courseSize
  //     courseSize = await this.getCourseSize({ courseId })

  //     //calculate newProgress
  //     const newProgress = parseFloat(((topicDone / courseSize) * 100).toFixed(1))

  //     //create new courseProgress
  //     const newCourseProgress = courseProgressRepo.create({
  //       course: { id: courseId },
  //       user: { id: userId },
  //       courseSize,
  //       progress: newProgress,
  //       topicDone
  //     })

  //     //save
  //     return await courseProgressRepo.save(newCourseProgress)
  //   }
  //   //was created before
  //   else {
  //     //increase topicDone
  //     topicDone = courseProgress.topicDone + 1
  //     courseSize = courseProgress.courseSize

  //     //newProgress
  //     const newProgress = parseFloat(((topicDone / courseSize) * 100).toFixed(1))
  //     courseProgress.topicDone = topicDone
  //     courseProgress.progress = newProgress

  //     //update
  //     return await courseProgressRepo.save(courseProgress)
  //   }
  // }

  getCourseSize = async ({ courseId }: { courseId: number }) => {
    //get all topic in course
    const course = (await courseRepository.findOne({ id: courseId }, { relations: ['courseTopics'] })) as Course
    console.log(course)

    const numberOfTopics = (course.courseTopics as CourseTopic[]).length
    return numberOfTopics
  }

  isTopicInCourse = async ({ topicId, courseId }: { topicId: number; courseId: number }) => {
    return (
      (await courseTopicRepository.findOne({
        topic: {
          id: topicId
        },
        course: {
          id: courseId
        }
      })) != null
    )
  }
}

export const courseService = new CourseService()
