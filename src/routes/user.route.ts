import express from 'express'
import { Resource } from '~/constants/access'
import { createUserController, updateUserController } from '~/controllers/user.controller'
import { accessTokenValidation } from '~/middlewares/auth/accessToken.middleware'
import { checkPermission } from '~/middlewares/auth/checkPermission.middleware'
import { checkIdParamMiddleware } from '~/middlewares/common.middlewares'
import { createUserValidation } from '~/middlewares/user/createUser.middleware'
import { updateUserValidation } from '~/middlewares/user/updateUser.middleware'
import { wrapRequestHandler } from '~/utils/handler'
export const userRouter = express.Router()

// authentication
userRouter.use(accessTokenValidation)

// GET
// /**
//  * @description : Get info account
//  * @method : GET
//  * @path : /account
//  * @header : Authorization
//  */
// userRoute.get('/account', accessTokenValidation, wrapRequestHandler(accountController))

// POST
/**
 * @description : Create new user
 * @method : POST
 * @path : /
 * @header : Authorization
 * @body : {
 *  email: string
    username: string
    password: string
    fullName: string
    avatar: string
    roleId: number
 * }
 */
userRouter.post(
  '/',
  wrapRequestHandler(checkPermission('createAny', Resource.USER)),
  createUserValidation,
  wrapRequestHandler(createUserController)
)
// PUT

// PATCH
/**
 * @description : Update user
 * @method : PATCH
 * @path : /
 * @header : Authorization
 * @body : {
 *  email?: string
    username?: string
    fullName?: string
    avatar?: string
    roleId?: number
    status?: UserStatus
 * }
 */
userRouter.patch(
  '/:id',
  wrapRequestHandler(checkPermission('updateAny', Resource.USER)),
  checkIdParamMiddleware(),
  updateUserValidation,
  wrapRequestHandler(updateUserController)
)
// DELETE
