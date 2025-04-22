import express from 'express'
import { completeTopicController, updateWordProgressController } from '~/controllers/userProgress.controller'
import { accessTokenValidation } from '~/middlewares/auth/accessToken.middleware'
import { completeTopicValidation } from '~/middlewares/userProgress/completeTopic.middleware'
import { updateWordProgressValidation } from '~/middlewares/userProgress/updateWordProgress.middleware'
import { wrapRequestHandler } from '~/utils/handler'

export const userProgressRouter = express.Router()

userProgressRouter.use(accessTokenValidation)

/**
 * @description : Complete topic
 * @method : POST
 * @path : /
 * @header : Authorization
 * @query : {topicId: number}
 */
userProgressRouter.post('/complete-topic', completeTopicValidation, wrapRequestHandler(completeTopicController))

//PUT
/**
 * @description : Update word progress
 * @method : PUT
 * @path : /
 * @header : Authorization
 * @query : wordProgress:{
 *      wrongCount: number
 *      wordId: number
 *      reviewedDate: Date
 *      }[]
 */
userProgressRouter.put(
  '/word',
  wrapRequestHandler(updateWordProgressValidation),
  wrapRequestHandler(updateWordProgressController)
)
