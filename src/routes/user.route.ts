import express from 'express'
import { Resource } from '~/constants/access'
import {
  createUserController,
  deleteUserById,
  getAllUsers,
  getUser,
  updateUserController
} from '~/controllers/user.controller'
import { accessTokenValidation } from '~/middlewares/auth/accessToken.middleware'
import { checkPermission } from '~/middlewares/auth/checkPermission.middleware'
import { checkIdParamMiddleware, checkQueryMiddleware } from '~/middlewares/common.middlewares'
import { createUserValidation } from '~/middlewares/user/createUser.middleware'
import { updateUserValidation } from '~/middlewares/user/updateUser.middleware'
import { wrapRequestHandler } from '~/utils/handler'
export const userRouter = express.Router()

/**
 * @description : Get user by id
 * @method : GET
 * @path : /:id
 * @header : Authorization
 * @params : id
 */
userRouter.get('/:id', checkIdParamMiddleware(), wrapRequestHandler(getUser))

// authentication
userRouter.use(accessTokenValidation)

// GET
/**
 * @description : Get all users
 * @method : GET
 * @path : /all
 * @header : Authorization
 * @query : {limit, page}
 */
userRouter.get(
  '/',
  wrapRequestHandler(checkPermission('readAny', Resource.USER)),
  checkQueryMiddleware({ numbericFields: ['page', 'limit'] }),
  wrapRequestHandler(getAllUsers)
)
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
 * @path : /:id
 * @header : Authorization
 * @params: id
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

/**
 * @description : Delete user by id
 * @method : DELETE
 * @path : /:id
 * @header : Authorization
 */
userRouter.delete(
  '/:id',
  // wrapRequestHandler(checkPermission('deleteAny', Resource.USER)),
  checkIdParamMiddleware(),
  wrapRequestHandler(deleteUserById)
)
