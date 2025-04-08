import express from 'express'
import { Resource } from '~/constants/access'
import { createTopicController, updateTopicController } from '~/controllers/topic.controller'
import { accessTokenValidation } from '~/middlewares/auth/accessToken.middleware'
import { checkPermission } from '~/middlewares/auth/checkPermission.middleware'
import { checkIdParamMiddleware } from '~/middlewares/common.middlewares'
import { createTopicValidation } from '~/middlewares/topic/createTopic.middleware'
import { updateTopicValidation } from '~/middlewares/topic/updateTopic.middleware'
import { wrapRequestHandler } from '~/utils/handler'
export const topicRouter = express.Router()

// GET

// authenticate....
topicRouter.use(accessTokenValidation)

// POST
/**
 * @description : Create new topic
 * @method : POST
 * @path : /
 * @header : Authorization
 * @body : topics: [
 *  {
        title: string
        description: string
        thumbnail?: string
        type?: TopicType
        wordIds: number[]
 * }
    ]
 */
topicRouter.post(
  '/',
  wrapRequestHandler(checkPermission('createAny', Resource.TOPIC)),
  createTopicValidation,
  wrapRequestHandler(createTopicController)
)
// PUT

// PATCH
/**
 * @description : Update topic by id
 * @method : PATCH
 * @path : /:id
 * @header : Authorization
 * @params : id
 * @body : {
 *  title: string
    description: string
    thumbnail?: string
    type?: TopicType
    wordIds: number[]
 * }
 */
topicRouter.patch(
  '/:id',
  wrapRequestHandler(checkPermission('updateAny', Resource.TOPIC)),
  checkIdParamMiddleware({}),
  updateTopicValidation,
  wrapRequestHandler(updateTopicController)
)
//DELETE
