import { FindOptionsOrder } from 'typeorm'
import { Course } from '~/entities/course.entity'

export interface courseQueryReq {
  page?: number
  limit?: number
  title?: string
  description?: string
  target?: string
  level?: string
  sort?: FindOptionsOrder<Course>
}
