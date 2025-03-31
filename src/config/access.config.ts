import { AccessControl } from 'accesscontrol'
import { Role } from '~/entities/role.entity'
import { permissionService } from '~/services/permission.service'
import { roleService } from '~/services/role.service'

const ac = new AccessControl()

export const grantList = async (role: Role) => {
  const permissions = await roleService.findPermissionByRole({ roleId: role.id as number })

  permissions.forEach((permission) => {
    ac.grant({
      role: role.name,
      ...permission
    })
  })

  return ac
}
