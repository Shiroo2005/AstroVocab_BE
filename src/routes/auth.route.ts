import express from 'express'
import { loginController, registerController } from '~/controllers/auth.controller'
import { loginValidation } from '~/middlewares/auth/login.middlewares'
import { registerValidation } from '~/middlewares/auth/register.middlewares'
import { wrapRequestHandler } from '~/utils/handler'
const authRouter = express.Router()

// GET

// POST
authRouter.post('/register', registerValidation, wrapRequestHandler(registerController))

authRouter.post('/login', loginValidation, wrapRequestHandler(loginController))

// PUT

// DELETE
export default authRouter
