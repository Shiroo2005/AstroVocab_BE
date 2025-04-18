import { AccessControl } from 'accesscontrol'
import { Action, Resource, RoleName } from '~/constants/access'
import { Role } from '~/entities/role.entity'
import { roleService } from '~/services/role.service'

const ac = new AccessControl()

export const getGrantList = () => {
  //grant
  const grantList = [
    { role: RoleName.USER, resource: Resource.USER, action: Action.READ_ANY },

    // admin
    //resource: user
    { role: RoleName.ADMIN, resource: Resource.USER, action: Action.READ_ANY },
    { role: RoleName.ADMIN, resource: Resource.USER, action: Action.CREATE_ANY },
    { role: RoleName.ADMIN, resource: Resource.USER, action: Action.UPDATE_ANY },
    { role: RoleName.ADMIN, resource: Resource.USER, action: Action.DELETE_ANY },

    //resource: permission
    { role: RoleName.ADMIN, resource: Resource.PERMISSION, action: Action.READ_ANY },
    { role: RoleName.ADMIN, resource: Resource.PERMISSION, action: Action.CREATE_ANY },
    { role: RoleName.ADMIN, resource: Resource.PERMISSION, action: Action.UPDATE_ANY },
    { role: RoleName.ADMIN, resource: Resource.PERMISSION, action: Action.DELETE_ANY },

    //resource: role
    { role: RoleName.ADMIN, resource: Resource.ROLE, action: Action.READ_ANY },
    { role: RoleName.ADMIN, resource: Resource.ROLE, action: Action.CREATE_ANY },
    { role: RoleName.ADMIN, resource: Resource.ROLE, action: Action.UPDATE_ANY },
    { role: RoleName.ADMIN, resource: Resource.ROLE, action: Action.DELETE_ANY },

    //resource: word
    { role: RoleName.ADMIN, resource: Resource.WORD, action: Action.READ_ANY },
    { role: RoleName.ADMIN, resource: Resource.WORD, action: Action.CREATE_ANY },
    { role: RoleName.ADMIN, resource: Resource.WORD, action: Action.UPDATE_ANY },
    { role: RoleName.ADMIN, resource: Resource.WORD, action: Action.DELETE_ANY },

    //resource: topic
    { role: RoleName.ADMIN, resource: Resource.TOPIC, action: Action.READ_ANY },
    { role: RoleName.ADMIN, resource: Resource.TOPIC, action: Action.CREATE_ANY },
    { role: RoleName.ADMIN, resource: Resource.TOPIC, action: Action.UPDATE_ANY },
    { role: RoleName.ADMIN, resource: Resource.TOPIC, action: Action.DELETE_ANY },

    //resource: course
    { role: RoleName.ADMIN, resource: Resource.COURSE, action: Action.READ_ANY },
    { role: RoleName.ADMIN, resource: Resource.COURSE, action: Action.CREATE_ANY },
    { role: RoleName.ADMIN, resource: Resource.COURSE, action: Action.UPDATE_ANY },
    { role: RoleName.ADMIN, resource: Resource.COURSE, action: Action.DELETE_ANY }
  ]

  // convert to grant list

  return grantList
}

export const grantList = async (role: Role) => {
  let permissions = role.permissions

  if (!permissions) {
    permissions = await roleService.findPermissionByRole({ roleId: role.id as number })
  }

  if (permissions)
    permissions.forEach((permission) => {
      ac.grant({ role: role.name, ...permission })
    })

  return ac
}
