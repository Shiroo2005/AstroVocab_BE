import express from 'express'
import { sendVerificationEmailController } from '~/controllers/auth.controller'
import { accessTokenValidation } from '~/middlewares/auth/accessToken.middleware'
import { sendVerificationEmailValidation } from '~/middlewares/email/sendVerificationEmail.middleware'
import { wrapRequestHandler } from '~/utils/handler'

export const emailRouter = express.Router()

emailRouter.use(accessTokenValidation({ relations: ['role'] }))

//GET

//POST
emailRouter.post(
  '/send-verification',
  wrapRequestHandler(sendVerificationEmailValidation),
  wrapRequestHandler(sendVerificationEmailController)
)
