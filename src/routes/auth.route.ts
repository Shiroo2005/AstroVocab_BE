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

/*
  Description: Get new tokens
  Method: POST
  Path: /refresh-token
  Body: {refreshToken: string}
*/
authRouter.post(
  '/refresh-token',
  accessTokenValidation,
  refreshTokenValidation,
  wrapRequestHandler(refreshTokenController)
)

/*
  Description: Get info account
  Method: GET
  Path: /account
  Header: Authorization
*/
authRouter.get('/account', accessTokenValidation, wrapRequestHandler(accountController))

// POST
/*
  Description: Register new user
  Method: POST
  Path: /register
  Body: {email: string, username: string, password: string, fullName: string}
*/
authRouter.post('/register', registerValidation, wrapRequestHandler(registerController))

/*
  Description: Login user
  Method: POST
  Path: /login
  Body: {username: string, password: string}
*/
authRouter.post('/login', loginValidation, wrapRequestHandler(loginController))

/*
  Description: Logout user
  Method: POST
  Path: /logout
  Body: {refreshToken}
  Header: Authorization
*/
authRouter.post('/logout', accessTokenValidation, refreshTokenValidation, wrapRequestHandler(logoutController))

// PUT

// DELETE
export default authRouter
