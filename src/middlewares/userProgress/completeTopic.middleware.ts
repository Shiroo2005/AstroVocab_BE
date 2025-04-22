import { checkSchema } from 'express-validator'
import { validateSchema } from '~/utils/validate'
import { isNumber } from '../common.middlewares'
import { topicService } from '~/services/topic.service'
import { BadRequestError, NotFoundRequestError } from '~/core/error.response'
import { CompleteTopicBodyReq } from '~/dto/req/topic/completeTopicBody.req'
import { Topic } from '~/entities/topic.entity'

export const completeTopicValidation = validateSchema(
  checkSchema(
    {
      topicId: {
        ...isNumber('topicId'),
        custom: {
          options: async (topicId, { req }) => {
            //if Topic exits
            const foundTopic = await topicService.getTopicById({ id: topicId })
            if (!Object.keys(foundTopic)) throw new NotFoundRequestError('Topic id invalid')
            ;(req.body as CompleteTopicBodyReq).topic = foundTopic as Topic

            //check if topic was complete before
            const isAlreadyDone = await topicService.isTopicAlreadyCompleted({ topicId })
            if (isAlreadyDone) throw new BadRequestError('Topic was completed before!')
            return true
          }
        }
      }
    },
    ['body']
  )
)
