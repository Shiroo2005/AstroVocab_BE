import { checkSchema } from 'express-validator'
import { validateSchema } from '~/utils/validate'
import { isLength, isRequired } from '../common.middlewares'
import { BadRequestError } from '~/core/error.response'
import { isValidEnumValue } from '~/utils'
import { CourseLevel } from '~/constants/couse'
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
      topicIds: {
        optional: true,
        isArray: true
      }
    },
    ['body']
  )
)
