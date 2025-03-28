import { RoleName } from '~/constants/access'
import { Role } from '~/entities/role.entity'

export async function seedRoles() {
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
