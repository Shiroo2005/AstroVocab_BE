import { Permission, Query } from 'accesscontrol'
import { Request, Response, NextFunction } from 'express'
import { grantList } from '~/config/access.config'
import { AuthRequestError, BadRequestError, ForbiddenRequestError } from '~/core/error.response'

const checkPermission = (action: keyof Query, resource: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role
    if (!role) {
      throw new AuthRequestError('Unauthorized!')
    }
    const ac = await grantList(role)

    if (!Object.keys(ac.grant()).length) throw new BadRequestError(`Role don't have any permisison!`)
    const permission = ac.can(role.name)[action](resource) as Permission

    if (!permission.granted) {
      throw new ForbiddenRequestError('Forbidden!')
    }

    next()
  }
}

export { checkPermission }
