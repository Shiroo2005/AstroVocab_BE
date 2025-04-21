import express from 'express'
import { completeTopicController } from '~/controllers/userProgress.controller'
import { accessTokenValidation } from '~/middlewares/auth/accessToken.middleware'
import { completeTopicValidation } from '~/middlewares/userProgress/completeTopic.middleware'
import { wrapRequestHandler } from '~/utils/handler'

export const userProgressRouter = express.Router()

userProgressRouter.use(accessTokenValidation)

userProgressRouter.post('/complete-topic', completeTopicValidation, wrapRequestHandler(completeTopicController))
