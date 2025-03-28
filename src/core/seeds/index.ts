import { Action, Possession, Resource, RoleName } from '~/constants/access'
import { Permission } from '~/entities/permission.entity'
import { Role } from '~/entities/role.entity'
import { User } from '~/entities/user.entity'
import { create } from '~/repositories/permission.repository'
import { permissionService } from '~/services/permission.service'
import { hashData } from '~/utils/jwt'

async function seedRoles() {
  const count = await Role.count() // Kiểm tra xem có dữ liệu chưa
  if (count === 0) {
    await Role.bulkCreate([
      { name: RoleName.ADMIN, description: 'Administrator role' },
      { name: RoleName.USER, description: 'Default user role' }
    ])
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
    await permissionService.createPermission({
      roleId: 1,
      permissions: [
        Permission.build({
          resource: Resource.ROLE,
          action: Action.READ,
          attributes: '*',
          possession: Possession.ANY
        }),
        Permission.build({
          resource: Resource.ROLE,
          action: Action.CREATE,
          attributes: '*',
          possession: Possession.ANY
        }),

        Permission.build({
          resource: Resource.ROLE,
          action: Action.UPDATE,
          attributes: '*',
          possession: Possession.ANY
        }),

        Permission.build({
          resource: Resource.ROLE,
          action: Action.DELETE,
          attributes: '*',
          possession: Possession.ANY
        })
      ]
    })
    // user
    await permissionService.createPermission({
      roleId: 2,
      permissions: [
        Permission.build({
          resource: Resource.ROLE,
          action: Action.READ,
          attributes: '*',
          possession: Possession.ANY
        })
      ]
    })
    console.log('✅ Seeded Permissions successfully!')
  } else {
    console.log('ℹ️ Permissions already exist, skipping seed...')
  }
}

export function seedData() {
  seedRoles()
  seedUsers()
  seedPermissions()
}
