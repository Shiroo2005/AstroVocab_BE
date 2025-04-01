import express from 'express'
import {
  createPermissionController,
  deletePermissionController,
  findPermissonController,
  updatePermissionController
} from '~/controllers/permission.controller'
import { accessTokenValidation } from '~/middlewares/auth/accessToken.middleware'
import { checkIdParamMiddleware, checkQueryRequiredMiddleware } from '~/middlewares/common.middlewares'
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
permissionRouter.get('/', checkQueryRequiredMiddleware(['roleId']), wrapRequestHandler(findPermissonController))

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
permissionRouter.post('/', createPermissionValidation, wrapRequestHandler(createPermissionController))

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
permissionRouter.put('/:id', updatePermissionValidation, wrapRequestHandler(updatePermissionController))

// DELETE
/**
 * @description : Delete permission by id
 * @method : DELETE
 * @path : /
 * @header : Authorization
 * @params : id
 * }
 */
permissionRouter.delete('/:id', checkIdParamMiddleware(), wrapRequestHandler(deletePermissionController))
