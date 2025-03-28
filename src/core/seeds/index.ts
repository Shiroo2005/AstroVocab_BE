import { RoleName } from '~/constants/access'
import { Role } from '~/entities/role.entity'
import { User } from '~/entities/user.entity'
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

export function seedData() {
  // seedRoles()
  // seedUsers()
}
