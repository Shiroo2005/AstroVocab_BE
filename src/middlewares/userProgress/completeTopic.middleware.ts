import { checkSchema } from 'express-validator'
import { validateSchema } from '~/utils/validate'
import { isNumber } from '../common.middlewares'
import { topicService } from '~/services/topic.service'
import { BadRequestError } from '~/core/error.response'

export const completeTopicValidation = validateSchema(
  checkSchema(
    {
      topicId: {
        ...isNumber('topicId'),
        custom: {
          options: async (topicId) => {
            //check if topic was complete before
            const isExist = await topicService.isTopicAlreadyCompleted({ topicId })
            if (isExist) throw new BadRequestError('Topic was completed before!')
            return true
          }
        }
      }
    },
    ['body']
  )
)
