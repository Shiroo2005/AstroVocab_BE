import express from 'express'
import { Resource } from '~/constants/access'
import { roleController } from '~/controllers/role.controller'
import { accessTokenValidation } from '~/middlewares/auth/accessToken.middleware'
import { checkPermission } from '~/middlewares/auth/checkPermission.middleware'
import { checkIdParamMiddleware } from '~/middlewares/common.middlewares'
import { wrapRequestHandler } from '~/utils/handler'
const roleRouter = express.Router()

// GET
roleRouter.get(
  '/all',
  accessTokenValidation,
  wrapRequestHandler(checkPermission('readAny', Resource.ROLE)),
  wrapRequestHandler(roleController.getAllRoles)
)

roleRouter.get('/:id', checkIdParamMiddleware, wrapRequestHandler(roleController.getRole))

// authenticate....

// POST
roleRouter.post('/', wrapRequestHandler(roleController.createRole))
// PUT
roleRouter.put('/:id', checkIdParamMiddleware, wrapRequestHandler(roleController.putRole))

// DELETE
roleRouter.delete('/:id', checkIdParamMiddleware, wrapRequestHandler(roleController.deleteRoleById))

export default roleRouter
