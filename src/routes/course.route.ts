import express from 'express'
import { Resource } from '~/constants/access'
import {
  createCourseController,
  getAllCoursesController,
  getCourseController,
  updateCourseController
} from '~/controllers/course.controller'
import { Course } from '~/entities/course.entity'
import { Word } from '~/entities/word.entity'
import { accessTokenValidation } from '~/middlewares/auth/accessToken.middleware'
import { checkPermission } from '~/middlewares/auth/checkPermission.middleware'
import { checkIdParamMiddleware, checkQueryMiddleware, parseSort } from '~/middlewares/common.middlewares'
import { createCourseValidation } from '~/middlewares/course/createCourse.middleware'
import { updateCourseValidation } from '~/middlewares/course/updateCourse.middleware'
import { wrapRequestHandler } from '~/utils/handler'
export const courseRouter = express.Router()

// GET
/**
 * @description : Get course by id
 * @method : GET
 * @path : /:id
 */
courseRouter.get(
  '/:id',
  // wrapRequestHandler(checkPermission('createAny', Resource.COURSE)),
  checkIdParamMiddleware({}),
  wrapRequestHandler(getCourseController)
)

/**
 * @description : Get all courses
 * @method : GET
 * @path : /
 * @query : {
 *  page?: number
 *  limit?: number
 *  }
 */
courseRouter.get(
  '/',
  // wrapRequestHandler(checkPermission('createAny', Resource.COURSE)),
  checkQueryMiddleware(),
  wrapRequestHandler(parseSort({ allowSortList: Course.allowSortList })),
  wrapRequestHandler(getAllCoursesController)
)

// authenticate....
courseRouter.use(accessTokenValidation)

// POST
/**
 * @description : Create new course
 * @method : POST
 * @path : /
 * @header : Authorization
 * @body : courses: [
 *  {
        title: string
        description: string
        target: string
        level?: CourseLevel
        topicIds: number[]
 * }
    ]
 */
courseRouter.post(
  '/',
  // wrapRequestHandler(checkPermission('createAny', Resource.COURSE)),
  createCourseValidation,
  wrapRequestHandler(createCourseController)
)

// PUT

// PATCH
/**
 * @description : Update course by id
 * @method : PATCH
 * @path : /
 * @header : Authorization
 * @body : courses: [
*  {
        title?: string
        description?: string
        target?: string
        level?: CourseLevel
        topicIds?: number[]
 * }
    ]
 */
courseRouter.patch(
  '/:id',
  // wrapRequestHandler(checkPermission('createAny', Resource.COURSE)),
  checkIdParamMiddleware({}),
  updateCourseValidation,
  wrapRequestHandler(updateCourseController)
)

// DELETE
