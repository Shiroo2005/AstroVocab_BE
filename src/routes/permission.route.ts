import express from 'express'
import { Resource } from '~/constants/access'
import {
  createPermissionController,
  deletePermissionController,
  findPermissonController,
  updatePermissionController
} from '~/controllers/permission.controller'
import { accessTokenValidation } from '~/middlewares/auth/accessToken.middleware'
import { checkPermission } from '~/middlewares/auth/checkPermission.middleware'
import { checkIdParamMiddleware, checkQueryMiddleware } from '~/middlewares/common.middlewares'
import { createPermissionValidation } from '~/middlewares/permission/createPermission.middleware'
import { updatePermissionValidation } from '~/middlewares/permission/updatePermission.middleware'
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
  wrapRequestHandler(checkPermission('readAny', Resource.PERMISSION)),
  checkQueryMiddleware({ requiredFields: ['roleId'] }),
  wrapRequestHandler(findPermissonController)
)

//  POST
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
  wrapRequestHandler(checkPermission('createAny', Resource.PERMISSION)),
  createPermissionValidation,
  wrapRequestHandler(createPermissionController)
)

// PUT
/**
 * @description : Update permission
 * @method : PUT
 * @path : /
 * @header : Authorization
 * @params : id
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
permissionRouter.put(
  '/:id',
  wrapRequestHandler(checkPermission('updateAny', Resource.PERMISSION)),
  updatePermissionValidation,
  wrapRequestHandler(updatePermissionController)
)

// DELETE
/**
 * @description : Delete permission by id
 * @method : DELETE
 * @path : /
 * @header : Authorization
 * @params : id
 * }
 */
permissionRouter.delete(
  '/:id',
  wrapRequestHandler(checkPermission('deleteAny', Resource.PERMISSION)),
  checkIdParamMiddleware(),
  wrapRequestHandler(deletePermissionController)
)
