import express from 'express'
import { Resource } from '~/constants/access'
import {
  createUserController,
  deleteUserById,
  getAllUsers,
  getUser,
  restoreUserById,
  updateUserController
} from '~/controllers/user.controller'
import { User } from '~/entities/user.entity'
import { accessTokenValidation } from '~/middlewares/auth/accessToken.middleware'
import { checkPermission } from '~/middlewares/auth/checkPermission.middleware'
import { checkIdParamMiddleware, checkQueryMiddleware, parseSort } from '~/middlewares/common.middlewares'
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
 * @path : /
 * @header : Authorization
 * @query : {limit: number, page:number, fullName:string, roleName:string, status:userStatus, sort: string}
 * sort like id | -id
 * sort field must be in [id, fullName, username, email]
 * filter field must be in [
 *  fullName?: string
    username?: string
    roleName?: string
    status?: UserStatus
 * ]
 */
userRouter.get(
  '/',
  wrapRequestHandler(checkPermission('readAny', Resource.USER)),
  checkQueryMiddleware({ numbericFields: ['page', 'limit'] }),
  wrapRequestHandler(parseSort({ allowSortList: User.allowSortList })),
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
 * @params : id
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

/**
 * @description : Restore user from deleted
 * @method : PATCH
 * @path : /:id/restore
 * @header : Authorization
 * @params: id
 */
userRouter.patch(
  '/:id/restore',
  wrapRequestHandler(checkPermission('updateAny', Resource.USER)),
  checkIdParamMiddleware(),
  wrapRequestHandler(restoreUserById)
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
