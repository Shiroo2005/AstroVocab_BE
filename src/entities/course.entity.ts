import { IsEnum, IsNotEmpty, IsOptional, Length } from 'class-validator'
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
  @IsNotEmpty({ message: 'Title must be a not empty string!' })
  @Length(1, 255, { message: 'Title must be between 1 and 255 chars long!' })
  title!: string

  @Column('varchar')
  @IsNotEmpty({ message: 'Description must be a not empty string!' })
  @Length(1, 255, { message: 'Description must be between 1 and 255 chars long!' })
  description!: string

  @Column('varchar')
  @IsNotEmpty({ message: 'Target must be a not empty string!' })
  @Length(1, 255, { message: 'Target must be between 1 and 255 chars long!' })
  target!: string

  @Column('varchar', { default: CourseLevel.INTERMEDIATE })
  @IsEnum(CourseLevel, { message: 'level must be in enum CourseLevel' })
  @IsOptional()
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
