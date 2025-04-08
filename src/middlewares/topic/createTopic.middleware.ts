import { checkSchema } from 'express-validator'
import { validateSchema } from '~/utils/validate'
import { isLength, isRequired } from '../common.middlewares'
import { BadRequestError } from '~/core/error.response'
import { isValidEnumValue } from '~/utils'
import { TopicType } from '~/constants/topic'
export const createTopicValidation = validateSchema(
  checkSchema(
    {
      topics: {
        isArray: true,
        custom: {
          options: (value) => {
            if (!Array.isArray(value) || value.length === 0) {
              throw new BadRequestError('topics must contain at least 1 item')
            }
            return true
          },
          bail: true
        }
      },
      'topics.*.title': {
        ...isRequired('title'),
        isString: true,
        ...isLength({ fieldName: 'title', min: 10, max: 255 })
      },
      'topics.*.description': {
        ...isRequired('description'),
        isString: true,
        ...isLength({ fieldName: 'description', min: 10, max: 255 })
      },
      'topics.*.thumbnail': {
        optional: true,
        isString: true,
        ...isLength({ fieldName: 'thumbnail', max: 255 })
      },
      'topics.*.type': {
        optional: true,
        custom: {
          options: (value) => {
            // is enum in Topic Type
            if (!isValidEnumValue(value, TopicType)) throw new BadRequestError('field type must be in Enum TOPIC TYPE!')
            return true
          }
        }
      },
      'topics.*.wordIds': {
        isArray: true
      }
    },
    ['body']
  )
)
