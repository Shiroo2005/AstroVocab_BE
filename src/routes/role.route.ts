import express from 'express'
import { Resource } from '~/constants/access'
import { roleController } from '~/controllers/role.controller'
import { accessTokenValidation } from '~/middlewares/auth/accessToken.middleware'
import { checkPermission } from '~/middlewares/auth/checkPermission.middleware'
import { checkIdParamMiddleware } from '~/middlewares/common.middlewares'
import { wrapRequestHandler } from '~/utils/handler'
const roleRouter = express.Router()

// GET

// authenticate....
roleRouter.use(accessTokenValidation)

/**
 * @description : Get all roles
 * @method : GET
 * @path : /all
 * @header : Authorization
 */
roleRouter.get(
  '/all',
  wrapRequestHandler(checkPermission('readAny', Resource.ROLE)),
  wrapRequestHandler(roleController.getAllRoles)
)

/**
 * @description : Get role by id
 * @method : GET
 * @path : /:id
 * @param : id
 * @header : Authorization
 */
roleRouter.get(
  '/:id',
  wrapRequestHandler(checkPermission('readAny', Resource.ROLE)),
  checkIdParamMiddleware(),
  wrapRequestHandler(roleController.getRole)
)

// POST
/**
 * @description : Create new role
 * @method : POST
 * @path : /
 * @header : Authorization
 * @body : {name: string, description?: string, permissionIds?: number[]}
 */
roleRouter.post(
  '/',
  wrapRequestHandler(checkPermission('createAny', Resource.ROLE)),
  wrapRequestHandler(roleController.createRole)
)

// PUT

/**
 * @description : Update role by id
 * @method : PUT
 * @path : /:id
 * @header : Authorization
 * @body : {name: string, description?: string, permisisonIds: number}
 */
roleRouter.put(
  '/:id',
  wrapRequestHandler(checkPermission('updateAny', Resource.ROLE)),
  checkIdParamMiddleware(),
  wrapRequestHandler(roleController.putRole)
)

// DELETE
roleRouter.delete(
  '/:id',
  wrapRequestHandler(checkPermission('deleteAny', Resource.ROLE)),
  checkIdParamMiddleware(),
  wrapRequestHandler(roleController.deleteRoleById)
)

export default roleRouter
