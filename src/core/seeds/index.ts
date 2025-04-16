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

async function seedUsers() {
  const [users, count] = await userRepository.count({}) // Kiểm tra xem có dữ liệu chưa

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
        email: 'Admin002@gmail.com',
        fullName: 'Admin002',
        password: 'Admin123',
        role: adminRole,
        username: 'Admin002'
      },
      ...createRandomUser()
    ]

    await userRepository.userRepo.save(data)

    console.log('✅ Seeded Users successfully!')
  } else {
    console.log('ℹ️ Users already exist, skipping seed...')
  }
}

async function seedWords() {
  const count = await wordRepository.wordRepo.count()
  if (count > 0) {
    console.log('ℹ️ Words already exist, skipping seed...')
    return
  }

  await wordRepository.saveAll(wordSeedData)
  console.log('✅ Seeded Words successfully!')
}

async function seedTopics() {
  const count = await topicRepository.topicRepo.count()
  if (count > 0) {
    console.log('ℹ️ Topics already exist, skipping seed...')
    return
  }

  await topicRepository.saveAll(topicSeedData)
  console.log('✅ Seeded Topics successfully!')
}

async function seedCourses() {
  const count = await courseRepository.courseRepo.count()
  if (count > 0) {
    console.log('ℹ️ Courses already exist, skipping seed...')
    return
  }

  await courseRepository.saveAll(courseSeedData)
  console.log('✅ Seeded Courses successfully!')
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

  await seedWords()

  await seedTopics()

  await seedCourses()
}
