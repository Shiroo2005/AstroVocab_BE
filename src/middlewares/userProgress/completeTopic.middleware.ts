import { checkSchema } from 'express-validator'
import { validateSchema } from '~/utils/validate'
import { isNumber } from '../common.middlewares'
import { topicService } from '~/services/topic.service'
import { BadRequestError, NotFoundRequestError } from '~/core/error.response'
import { CompleteTopicBodyReq } from '~/dto/req/topic/completeTopicBody.req'
import { Topic } from '~/entities/topic.entity'
import { User } from '~/entities/user.entity'
import { Request } from 'express'

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
            const isAlreadyDone = await topicService.isTopicAlreadyCompleted({
              topicId,
              userId: (req as Request).user?.id as number
            })
            if (isAlreadyDone) throw new BadRequestError('Topic was completed before!')
            return true
          }
        }
      }
    },
    ['body']
  )
)
