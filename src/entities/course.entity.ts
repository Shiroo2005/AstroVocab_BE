import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { CourseLevel } from '~/constants/couse'
import { CourseTopic } from './courseTopic.entity'

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id?: number

  @Column('varchar')
  title!: string

  @Column('varchar')
  description!: string

  @Column('varchar')
  target!: string

  @Column('varchar', { default: CourseLevel.INTERMEDIATE })
  level?: CourseLevel

  //foreign key
  @OneToMany(() => CourseTopic, (courseTopic) => courseTopic.course, { cascade: true })
  courseTopics?: CourseTopic[]

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  static create = ({ id, title, description, target, level, courseTopics }: Course) => {
    const newCourse = new Course()
    newCourse.id = id
    newCourse.title = title
    newCourse.description = description
    newCourse.target = target
    newCourse.level = level
    newCourse.courseTopics = courseTopics

    return newCourse
  }

  static update = (
    course: Course,
    {
      title,
      description,
      target,
      level,
      courseTopics
    }: {
      title?: string
      description?: string
      target?: string
      level?: CourseLevel
      courseTopics?: CourseTopic[]
    }
  ) => {
    if (title) course.title = title
    if (description) course.description = description
    if (target) course.target = target
    if (level) course.level = level
    if (courseTopics) course.courseTopics = courseTopics

    return course
  }

  static allowSortList = ['id', 'title', 'level', 'target', 'description']
}
