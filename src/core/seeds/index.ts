import { Action, Resource, RoleName } from '~/constants/access'
import { Permission } from '~/entities/permission.entity'
import { Role } from '~/entities/role.entity'
import { User } from '~/entities/user.entity'
import { permissionService } from '~/services/permission.service'
import { roleService } from '~/services/role.service'
import { hashData } from '~/utils/jwt'

async function seedRoles() {
  const count = await Role.count() // Kiểm tra xem có dữ liệu chưa
  if (count === 0) {
    const createRoleBody = [
      { name: RoleName.ADMIN, description: 'Administrator role', permissionIds: [1, 2, 3, 4] },
      { name: RoleName.USER, description: 'Default user role', permissionIds: [1, 2] }
    ]
    for (const data of createRoleBody) {
      await roleService.createRole(data)
    }
    console.log('✅ Seeded Roles successfully!')
  } else {
    console.log('ℹ️ Roles already exist, skipping seed...')
  }
}

async function seedUsers() {
  const count = await User.count() // Kiểm tra xem có dữ liệu chưa
  if (count === 0) {
    await User.bulkCreate([
      {
        email: 'Admin001@gmail.com',
        fullName: 'Admin001',
        password: hashData('Admin123'),
        roleId: 1,
        username: 'Admin001'
      },
      { email: 'User001@gmail.com', fullName: 'User001', password: hashData('User123'), roleId: 2, username: 'User001' }
    ])
    console.log('✅ Seeded Users successfully!')
  } else {
    console.log('ℹ️ Users already exist, skipping seed...')
  }
}

async function seedPermissions() {
  const count = await Permission.count()
  if (count == 0) {
    // admin
    const permissions = [
      {
        resource: Resource.ROLE,
        action: Action.READ_ANY
      },
      {
        resource: Resource.ROLE,
        action: Action.CREATE_ANY
      },
      {
        resource: Resource.ROLE,
        action: Action.UPDATE_ANY
      },
      {
        resource: Resource.ROLE,
        action: Action.DELETE_ANY
      }
    ]
    for (const permission of permissions) {
      const data = Permission.build(permission).dataValues as Permission
      await permissionService.createPermission({ permission: data })
    }

    console.log('✅ Seeded Permissions successfully!')
  } else {
    console.log('ℹ️ Permissions already exist, skipping seed...')
  }
}

export async function seedData() {
  await seedPermissions()
  await seedRoles()
  await seedUsers()
}
