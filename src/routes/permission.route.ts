import express from 'express'
import { createPermissionController, findPermissonController } from '~/controllers/permission.controller'
import { accessTokenValidation } from '~/middlewares/auth/accessToken.middleware'
import { checkQueryRequiredMiddleware } from '~/middlewares/common.middlewares'
import { createPermissionValidation } from '~/middlewares/permission/createPermission.middleware'
import { wrapRequestHandler } from '~/utils/handler'
export const permissionRouter = express.Router()

// GET

// authenticate....

permissionRouter.use(accessTokenValidation)

/**
 * @description : Get permissions by roleId
 * @method : GET
 * @path : /
 * @header : Authorization
 * @body :{}
 */
permissionRouter.get(
  '/',
  accessTokenValidation,
  checkQueryRequiredMiddleware(['roleId']),
  wrapRequestHandler(findPermissonController)
)

/**
 * @description : Create permissions
 * @method : POST
 * @path : /
 * @header : Authorization
 * @body : {
 *  [
 *      roleId: number,
 *      permission : [
 *          resource: string,
 *          action: string,
 *          attribute: string
 *       ]
 * ]
 * }
 */
permissionRouter.post(
  '/',
  accessTokenValidation,
  createPermissionValidation,
  wrapRequestHandler(createPermissionController)
)

// POST

// PUT

// DELETE
