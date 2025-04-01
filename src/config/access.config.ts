import { AccessControl } from 'accesscontrol'
import { Role } from '~/entities/role.entity'
import { roleService } from '~/services/role.service'

const ac = new AccessControl()

export const grantList = async (role: Role) => {
  const permissions = await roleService.findPermissionByRole({ roleId: role.id as number })

  if (permissions)
    permissions.forEach((permission) => {
      ac.grant({
        role: role.name,
        ...permission
      })
    })

  return ac
}
