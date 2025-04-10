import { checkSchema } from 'express-validator'
import { validateSchema } from '~/utils/validate'
import { isLength, isRequired } from '../common.middlewares'
import { BadRequestError } from '~/core/error.response'
import { isValidEnumValue } from '~/utils'
import { CourseLevel } from '~/constants/couse'
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
      'courses.*.topicIds': {
        isArray: true,
        custom: {
          options: (value: number[]) => {
            if (!Array.isArray(value) || value.length === 0)
              throw new BadRequestError('Course must have at least 1 topic!')
            return true
          }
        }
      }
    },
    ['body']
  )
)
