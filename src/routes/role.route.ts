import express from 'express'
import { Resource } from '~/constants/access'
import { createRole, deleteRoleById, getAllRoles, getRole, updateRole } from '~/controllers/role.controller'
import { accessTokenValidation } from '~/middlewares/auth/accessToken.middleware'
import { checkPermission } from '~/middlewares/auth/checkPermission.middleware'
import { checkIdParamMiddleware, checkQueryMiddleware } from '~/middlewares/common.middlewares'
import { wrapRequestHandler } from '~/utils/handler'
const roleRouter = express.Router()

// GET

// authenticate....
roleRouter.use(accessTokenValidation({}))

/**
 * @description : Get all roles
 * @method : GET
 * @path : /
 * @header : Authorization
 */
roleRouter.get(
  '/',
  wrapRequestHandler(checkPermission('readAny', Resource.ROLE)),
  checkQueryMiddleware({ numbericFields: ['limit', 'page'] }),
  wrapRequestHandler(getAllRoles)
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
  wrapRequestHandler(getRole)
)

// POST
/**
 * @description : Create new role
 * @method : POST
 * @path : /
 * @header : Authorization
 * @body : {name: string, description?: string, permissionIds?: number[]}
 */
roleRouter.post('/', wrapRequestHandler(checkPermission('createAny', Resource.ROLE)), wrapRequestHandler(createRole))

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
  wrapRequestHandler(updateRole)
)

// DELETE
roleRouter.delete(
  '/:id',
  wrapRequestHandler(checkPermission('deleteAny', Resource.ROLE)),
  checkIdParamMiddleware(),
  wrapRequestHandler(deleteRoleById)
)

export default roleRouter
