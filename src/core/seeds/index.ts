import { getGrantList } from '~/config/access.config'
import { Action, Resource } from '~/constants/access'
import { Permission } from '~/entities/permission.entity'
import { Role } from '~/entities/role.entity'
import { courseRepository } from '~/repositories/course.repository'
import { roleRepository } from '~/repositories/role.repository'
import { topicRepository } from '~/repositories/topic.repository'
import { userRepository } from '~/repositories/user.repository'
import { wordRepository } from '~/repositories/word.repository'
import { createRandomUser } from './data/user.data'
import { wordSeedData } from './data/word.data'
import { topicSeedData } from './data/topic.data'
import { courseSeedData } from './data/course.data'
import { permissionRepository } from '~/repositories/permission.repository'
import { topicService } from '~/services/topic.service'
import { User } from '~/entities/user.entity'
import { UserStatus } from '~/constants/userStatus'

async function seedUsers() {
  const count = await userRepository.count({}) // Kiểm tra xem có dữ liệu chưa

  const adminRole = (await roleRepository.findOne({ name: 'admin' })) as Role

  if (count === 0) {
    const data = [
      {
        email: 'Admin001@gmail.com',
        password: 'Admin123',
        role: adminRole,
        username: 'Admin001',
        fullName: 'ADMIN001',
        status: UserStatus.VERIFIED
      } as User,
      {
        email: 'Admin002@gmail.com',
        password: 'Admin123',
        role: adminRole,
        username: 'Admin002',
        fullName: 'ADMIN002',
        status: UserStatus.VERIFIED
      } as User,
      ...createRandomUser()
    ]

    await userRepository.save(data)

    console.log('✅ Seeded Users successfully!')
  } else {
    console.log('ℹ️ Users already exist, skipping seed...')
  }
}

async function seedWords() {
  const count = await wordRepository.count()
  if (count > 0) {
    console.log('ℹ️ Words already exist, skipping seed...')
    return
  }
  console.log('✅ Seeded Words successfully!')

  return await wordRepository.save(wordSeedData)
}

async function seedTopics() {
  const count = await topicRepository.count()
  if (count > 0) {
    console.log('ℹ️ Topics already exist, skipping seed...')
    return
  }
  const words = await seedWords()
  if (!words) return
  console.log('✅ Seeded Topics successfully!')

  return await topicService.createTopic(topicSeedData(words))
}

async function seedCourses() {
  const count = await courseRepository.count()
  if (count > 0) {
    console.log('ℹ️ Courses already exist, skipping seed...')
    return
  }

  const topics = await seedTopics()
  if (!topics) return
  console.log('✅ Seeded Courses successfully!')

  return await courseRepository.save(courseSeedData(topics))
}

const seedAccessControl = async (grantList: { role: string; resource: string; action: string }[]) => {
  const count = await roleRepository.count()
  if (count > 0) {
    console.log('ℹ️ Access control already exist, skipping seed...')
    return
  }

  const roleNames = Array.from(new Set(grantList.map(({ role }) => role)))

  // 1. Load all existing permissions
  const existingPermissions = (await permissionRepository.findAll({})).data
  const permissionMap = new Map<string, Permission>()

  for (const p of existingPermissions) {
    const key = `${p.resource}:${p.action}`
    permissionMap.set(key, p)
  }

  // 2. Ensure all permissions in grantList exist in DB
  for (const grant of grantList) {
    const key = `${grant.resource}:${grant.action}`
    if (!permissionMap.has(key)) {
      const newPermission = Permission.create({ resource: grant.resource as Resource, action: grant.action as Action })
      const createdPermission = await permissionRepository.save(newPermission)
      permissionMap.set(key, createdPermission[0])
    }
  }

  // 3. Create roles with permissions
  const roles = roleNames.map((roleName) => {
    const rolePermissions = grantList
      .filter((g) => g.role === roleName)
      .map((g) => permissionMap.get(`${g.resource}:${g.action}`)!)

    return Role.create({ name: roleName, permissions: rolePermissions })
  })

  await roleRepository.save(roles)
  console.log('✅ Seeded Access control successfully!')
}

export async function seedData() {
  await seedAccessControl(getGrantList())
  // await seedRoles()
  await seedUsers()

  await seedCourses()
}
