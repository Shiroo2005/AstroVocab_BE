import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm'
import { CourseLevel } from '~/constants/couse'
import { BadRequestError } from '~/core/error.response'
import { Course } from '~/entities/course.entity'
import { CourseTopic } from '~/entities/courseTopic.entity'
import { unGetData, unGetDataArray } from '~/utils'
import { validateClass } from '~/utils/validate'

class CourseRepository {
  courseRepo: Repository<Course>

  constructor() {
    this.init()
  }

  private async init() {
    const { DatabaseService } = await import('~/services/database.service.js')
    this.courseRepo = await DatabaseService.getInstance().getRepository(Course)
  }

  async saveOne({ title, description, target, level, courseTopics, id }: Course) {
    const course = Course.create({ title, description, target, level, courseTopics, id })
    //class validator
    await validateClass(course)

    return await this.courseRepo.save(course)
  }

  async saveAll(courses: Course[]) {
    const validCourses = []
    for (const _course of courses) {
      const course = Course.create(_course)
      //class validator
      await validateClass(course)
      validCourses.push(course)
    }
    console.log(courses)

    return await this.courseRepo.save(validCourses)
  }

  async updateOne({
    title,
    description,
    level,
    target,
    courseTopics,
    id
  }: {
    title?: string
    description?: string
    target?: string
    level?: CourseLevel
    courseTopics?: CourseTopic[]
    id: number
  }) {
    const foundCourse = (await courseRepository.findOne({
      where: {
        id
      }
    })) as Course | null
    if (!foundCourse) throw new BadRequestError('Course id not found!')

    const updateCourse = Course.update(foundCourse, {
      title,
      description,
      level,
      target,
      courseTopics
    })

    return await this.saveOne(updateCourse)
  }

  async findOne({
    where,
    unGetFields = ['deletedAt', 'createdAt', 'updatedAt'],
    relations
  }: {
    where: FindOptionsWhere<Course> | FindOptionsWhere<Course>[]
    unGetFields?: string[]
    relations?: string[]
  }) {
    const foundCourse = await this.courseRepo.findOne({
      where,
      relations
    })

    if (!foundCourse) return null

    return unGetData({ fields: unGetFields, object: foundCourse })
  }

  async findAll({
    limit,
    page,
    where,
    unGetFields = ['createdAt', 'updatedAt', 'deletedAt'],
    sort
  }: {
    limit: number
    page: number
    where?: FindOptionsWhere<Course>
    unGetFields?: string[]
    sort?: FindOptionsOrder<Course>
  }) {
    const skip = (page - 1) * limit
    const [foundCourses, total] = await this.courseRepo.findAndCount({
      where,
      skip,
      take: limit,
      order: sort
    })

    if (!foundCourses || foundCourses.length === 0) return null
    return {
      foundCourses: unGetDataArray({ fields: unGetFields, objects: foundCourses }),
      total
    }
  }

  async softDelete({ where }: { where: FindOptionsWhere<Course> }) {
    return await this.courseRepo.softDelete(where)
  }

  async restore(id: number) {
    return await this.courseRepo.restore({ id })
  }
}

export const courseRepository = new CourseRepository()
