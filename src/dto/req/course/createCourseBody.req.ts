import { CourseLevel } from '~/constants/couse'

export interface CreateCourseBodyReq {
  courses: CourseBody[]
}

export interface CourseBody {
  title: string
  description: string
  target: string
  level?: CourseLevel
  topics: {
    id: number
    displayOrder: number
  }[]
}
