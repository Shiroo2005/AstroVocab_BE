import { CourseLevel } from '~/constants/couse'

export interface CreateCourseBodyReq {
  courses: CourseBody[]
}

export interface CourseBody {
  title: string
  description: string
  target: string
  level?: CourseLevel
  topicIds: number[]
}
