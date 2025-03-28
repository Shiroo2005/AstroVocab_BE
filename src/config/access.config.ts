import { AccessControl } from 'accesscontrol'
import { Role } from '~/entities/role.entity'
import { permissionService } from '~/services/permission.service'

const ac = new AccessControl()

export const grantList = async (role: Role) => {
  const permissions = await permissionService.findPermissionByRole(role.id as number)

  permissions.forEach((permission) => {
    ac.grant({
      role: role.name,
      ...permission
    })
  })

  return ac
}
