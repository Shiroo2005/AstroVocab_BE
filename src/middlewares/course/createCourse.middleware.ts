import { checkSchema } from 'express-validator'
import { validateSchema } from '~/utils/validate'
import { isLength, isNumber, isRequired } from '../common.middlewares'
import { BadRequestError } from '~/core/error.response'
import { isValidEnumValue } from '~/utils'
import { CourseLevel } from '~/constants/couse'
import { CourseBody, CreateCourseBodyReq } from '~/dto/req/course/createCourseBody.req'
import _ from 'lodash'
export const createCourseValidation = validateSchema(
  checkSchema(
    {
      courses: {
        isArray: true,
        custom: {
          options: (value) => {
            if (!Array.isArray(value) || value.length === 0) {
              throw new BadRequestError('courses must contain at least 1 item')
            }
            return true
          },
          bail: true
        }
      },
      'courses.*.title': {
        ...isRequired('title'),
        isString: true,
        ...isLength({ fieldName: 'title', min: 10, max: 255 })
      },
      'courses.*.description': {
        ...isRequired('description'),
        isString: true,
        ...isLength({ fieldName: 'description', min: 10, max: 255 })
      },
      'courses.*.target': {
        ...isRequired('target'),
        isString: true,
        ...isLength({ fieldName: 'target', min: 10, max: 255 })
      },
      'courses.*.level': {
        optional: true,
        custom: {
          options: (value) => {
            // is enum in Topic Type
            if (!isValidEnumValue(value, CourseLevel))
              throw new BadRequestError('field level must be in Enum Course Level!')
            return true
          }
        }
      },
      'courses.*.topics': {
        isArray: true,
        custom: {
          options: (
            topics: {
              id: number
              displayOrder: number
            }[]
          ) => {
            // require display order is unique for each course
            // display order array need to be from 1 - N
            if (!isValidAndUniqueDisplayOrder(topics))
              throw new BadRequestError('Display order array need to be unique for each course and from 1 to N!')

            return true
          }
        }
      },
      'courses.*.topics.*.id': {
        ...isNumber('topicId')
      },
      'courses.*.topics.*.displayOrder': {
        ...isNumber('topicId')
      }
    },
    ['body']
  )
)

export const isValidAndUniqueDisplayOrder = (topics: { id: number; displayOrder: number }[]): boolean => {
  const orders = topics.map((t) => t.displayOrder)
  const unique = new Set(orders)

  if (unique.size !== orders.length) return false

  let max = 0
  for (const order of orders) {
    if (order <= 0) return false
    if (order > max) max = order
  }

  return max === orders.length
}
