import express from 'express'
import { loginController, logoutController, registerController } from '~/controllers/auth.controller'
import { loginValidation } from '~/middlewares/auth/login.middlewares'
import { registerValidation } from '~/middlewares/auth/register.middlewares'
import { refreshTokenValidation } from '~/middlewares/common.middlewares'
import { wrapRequestHandler } from '~/utils/handler'
const authRouter = express.Router()

// GET

// POST
authRouter.post('/register', registerValidation, wrapRequestHandler(registerController))

authRouter.post('/login', loginValidation, wrapRequestHandler(loginController))

authRouter.post('/logout', refreshTokenValidation, wrapRequestHandler(logoutController))

// PUT

// DELETE
export default authRouter
