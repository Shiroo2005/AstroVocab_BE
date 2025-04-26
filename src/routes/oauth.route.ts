import express from 'express'
import { oauthLoginCallbackController, oauthLoginController } from '~/controllers/auth.controller'
import { wrapRequestHandler } from '~/utils/handler'

export const oAuthRouter = express.Router()

oAuthRouter.get('/:provider', wrapRequestHandler(oauthLoginController))

oAuthRouter.get('/:provider/callback', wrapRequestHandler(oauthLoginCallbackController))
