import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Topic } from './topic.entity'
import { Course } from './course.entity'

@Entity()
@Index(['course', 'displayOrder'], { unique: true })
export class CourseTopic {
  @PrimaryGeneratedColumn()
  id?: number

  @Column('int')
  displayOrder: number

  //foreign key
  @ManyToOne(() => Course)
  course?: Course

  @ManyToOne(() => Topic)
  topic: Topic

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}
