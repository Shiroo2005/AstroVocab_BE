import { Role } from '~/entities/role.entity'

export async function seedRoles() {
  const count = await Role.count() // Kiểm tra xem có dữ liệu chưa
  if (count === 0) {
    await Role.bulkCreate([
      { name: 'ADMIN', description: 'Administrator role' },
      { name: 'USER', description: 'Default user role' }
    ])
    console.log('✅ Seeded Roles successfully!')
  } else {
    console.log('ℹ️ Roles already exist, skipping seed...')
  }
}
