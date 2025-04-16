import { getGrantList } from '~/config/access.config'
import { Action, Resource, RoleName } from '~/constants/access'
import { CourseLevel } from '~/constants/couse'
import { TopicType } from '~/constants/topic'
import { WordPosition, WordRank } from '~/constants/word'
import { Course } from '~/entities/course.entity'
import { CourseTopic } from '~/entities/courseTopic.entity'
import { Permission } from '~/entities/permission.entity'
import { Role } from '~/entities/role.entity'
import { Topic } from '~/entities/topic.entity'
import { Word } from '~/entities/word.entity'
import { courseRepository } from '~/repositories/course.repository'
import { roleRepository } from '~/repositories/role.repository'
import { topicRepository } from '~/repositories/topic.repository'
import { userRepository } from '~/repositories/user.repository'
import { wordRepository } from '~/repositories/word.repository'

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

async function seedWords() {
  const count = await wordRepository.wordRepo.count()
  if (count > 0) {
    console.log('ℹ️ Words already exist, skipping seed...')
    return
  }

  const sampleWords = Array.from({ length: 10 }, (_, i) =>
    Word.create({
      content: `word${i + 1}`,
      pronunciation: `/wɜːd${i + 1}/`,
      meaning: `Nghĩa của từ word${i + 1}`,
      position: WordPosition.NOUN,
      rank: WordRank.A1,
      example: `This is word${i + 1} in a sentence.`,
      translateExample: `Đây là ví dụ với word${i + 1}.`
    })
  )

  await wordRepository.saveAll(sampleWords)
  console.log('✅ Seeded 10 Words successfully!')
}

async function seedTopics() {
  const count = await topicRepository.topicRepo.count()
  if (count > 0) {
    console.log('ℹ️ Topics already exist, skipping seed...')
    return
  }

  const allWords = await wordRepository.wordRepo.find()
  const topics = Array.from({ length: 10 }, (_, i) => {
    // Gán ngẫu nhiên 2–3 từ cho mỗi topic
    const randomWords = allWords.slice(i % 5, (i % 5) + 3)

    return Topic.create({
      title: `Topic ${i + 1}`,
      description: `Mô tả của chủ đề ${i + 1}`,
      type: TopicType.FREE,
      words: randomWords
    })
  })

  await topicRepository.saveAll(topics)
  console.log('✅ Seeded 10 Topics successfully!')
}

async function seedCourses() {
  const count = await courseRepository.courseRepo.count()
  if (count > 0) {
    console.log('ℹ️ Courses already exist, skipping seed...')
    return
  }

  const topics = await topicRepository.topicRepo.find()

  const courses: Course[] = []

  for (let i = 0; i < 10; i++) {
    const selectedTopics = topics.slice(i % 5, (i % 5) + 2)

    const courseTopics: CourseTopic[] = selectedTopics.map((topic, idx) => {
      const ct = new CourseTopic()
      ct.topic = topic
      ct.displayOrder = idx + 1
      return ct
    })

    const course = Course.create({
      title: `Course ${i + 1}`,
      description: `Mô tả khoá học số ${i + 1}`,
      target: 'Beginner learners',
      level: CourseLevel.BEGINNER,
      courseTopics
    })

    courses.push(course)
  }

  await courseRepository.saveAll(courses)
  console.log('✅ Seeded 10 Courses successfully!')
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
