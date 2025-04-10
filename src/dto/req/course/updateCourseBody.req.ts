import { CourseLevel } from '~/constants/couse'

export interface UpdateCourseBodyReq {
  title?: string
  description?: string
  target?: string
  level?: CourseLevel
  topicIds?: number[]
}
