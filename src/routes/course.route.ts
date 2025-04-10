import express from 'express'
import { Resource } from '~/constants/access'
import { createCourseController, updateCourseController } from '~/controllers/course.controller'
import { createTopicController } from '~/controllers/topic.controller'
import { accessTokenValidation } from '~/middlewares/auth/accessToken.middleware'
import { checkPermission } from '~/middlewares/auth/checkPermission.middleware'
import { checkIdParamMiddleware } from '~/middlewares/common.middlewares'
import { createCourseValidation } from '~/middlewares/course/createCourse.middleware'
import { updateCourseValidation } from '~/middlewares/course/updateCourse.middleware'
import { wrapRequestHandler } from '~/utils/handler'
export const courseRouter = express.Router()

// GET

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
