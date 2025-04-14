import { checkSchema } from 'express-validator'
import { validateSchema } from '~/utils/validate'
import { isLength, isNumber, isRequired } from '../common.middlewares'
import { BadRequestError } from '~/core/error.response'
import { isValidEnumValue } from '~/utils'
import { CourseLevel } from '~/constants/couse'
import { isValidAndUniqueDisplayOrder } from './createCourse.middleware'
export const updateCourseValidation = validateSchema(
  checkSchema(
    {
      title: {
        optional: true,
        isString: true,
        ...isLength({ fieldName: 'title', min: 10, max: 255 })
      },
      description: {
        optional: true,
        isString: true,
        ...isLength({ fieldName: 'description', min: 10, max: 255 })
      },
      target: {
        optional: true,
        isString: true,
        ...isLength({ fieldName: 'target', min: 10, max: 255 })
      },
      level: {
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
      topics: {
        optional: true,
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
      'topics.*.id': {
        ...isNumber('topicId')
      },
      'topics.*.displayOrder': {
        ...isNumber('topicId')
      }
    },
    ['body']
  )
)
