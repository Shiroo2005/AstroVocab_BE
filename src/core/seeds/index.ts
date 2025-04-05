import { getGrantList } from '~/config/access.config'
import { Action, Resource, RoleName } from '~/constants/access'
import { Permission } from '~/entities/permission.entity'
import { Role } from '~/entities/role.entity'
import { roleRepository } from '~/repositories/role.repository'
import { userRepository } from '~/repositories/user.repository'
import { roleService } from '~/services/role.service'

async function seedRoles() {
  const [roles, count] = await roleRepository.count({}) // Kiểm tra xem có dữ liệu chưa
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
  const [users, count] = await userRepository.count({}) // Kiểm tra xem có dữ liệu chưa

  const userRole = (await roleRepository.findOne({ where: { name: 'user' } })) as Role
  const adminRole = (await roleRepository.findOne({ where: { name: 'admin' } })) as Role

  if (count === 0) {
    const data = [
      {
        email: 'Admin001@gmail.com',
        fullName: 'Admin001',
        password: 'Admin123',
        role: adminRole,
        username: 'Admin001'
      },
      {
        email: 'User001@gmail.com',
        fullName: 'User001',
        password: 'User1123',
        role: userRole,
        username: 'User001'
      }
    ]

    for (const user of data) {
      await userRepository.saveOne(user)
    }

    console.log('✅ Seeded Users successfully!')
  } else {
    console.log('ℹ️ Users already exist, skipping seed...')
  }
}

const seedAccessControl = async (
  grantList: {
    role: string
    resource: string
    action: string
  }[]
) => {
  const [role, count] = await roleRepository.count({})
  if (count === 0) {
    const roleNames = Array.from(new Set(grantList.map(({ role }) => role)))
    const permissions = grantList.map(({ resource, action }) => {
      return Permission.create({ resource: resource as Resource, action: action as Action })
    })
    const roles = roleNames.map((roleName) => {
      const rolePermissions = permissions.filter((permission) =>
        grantList.some(
          (grant) =>
            grant.role === roleName && grant.resource === permission.resource && grant.action === permission.action
        )
      )

      return Role.create({ name: roleName, permissions: rolePermissions })
    })

    // Lưu Role vào DB
    await roleRepository.roleRepo.save(roles)

    console.log('✅ Seeded Access control successfully!')
  } else {
    console.log('ℹ️ Access control already exist, skipping seed...')
  }
}

export async function seedData() {
  await seedAccessControl(getGrantList())
  // await seedRoles()
  await seedUsers()
}
