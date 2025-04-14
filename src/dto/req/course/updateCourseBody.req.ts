import { CourseLevel } from '~/constants/couse'

export interface UpdateCourseBodyReq {
  title?: string
  description?: string
  target?: string
  level?: CourseLevel
  topics: {
    id: number
    displayOrder: number
  }[]
}
