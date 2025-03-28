import express from 'express'
import {
  accountController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController
} from '~/controllers/auth.controller'
import { accessTokenValidation } from '~/middlewares/auth/accessToken.middleware'
import { loginValidation } from '~/middlewares/auth/login.middlewares'
import { refreshTokenValidation } from '~/middlewares/auth/refreshToken.middleware'
import { registerValidation } from '~/middlewares/auth/register.middlewares'
import { wrapRequestHandler } from '~/utils/handler'
const authRouter = express.Router()

// GET
/**
 * @description : Get info account
 * @method : GET
 * @path : /account
 * @header : Authorization
 */
authRouter.get('/account', accessTokenValidation, wrapRequestHandler(accountController))

// POST
/**
 * @description : recreate tokens
 * @method : POST
 * @path : /refresh-token
 * @body : {refreshToken: string}
 */
authRouter.post('/refresh-token', refreshTokenValidation, wrapRequestHandler(refreshTokenController))
/**
 * @description : Register new user
 * @method : POST
 * @path : /register
 * @body : {email: string, username: string, password: string, fullName: string}
 */
authRouter.post('/register', registerValidation, wrapRequestHandler(registerController))
/**
 * @description : Login user
 * @method : POST
 * @path : /login
 * @body : {username: string, password: string}
 */
authRouter.post('/login', loginValidation, wrapRequestHandler(loginController))
/**
 * @description : Logout user
 * @method : POST
 * @path : /logout
 * @body : {refreshToken}
 * @header : Authorization
 */

authRouter.post('/logout', accessTokenValidation, refreshTokenValidation, wrapRequestHandler(logoutController))

// PUT

// DELETE
export default authRouter
