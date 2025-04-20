import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'
import { Course } from './course.entity'
import { IsNumber, Max, Min } from 'class-validator'

@Entity()
export class CourseProgress extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @Column('int')
  @IsNumber()
  @Min(0)
  @Max(100)
  progress!: number

  @ManyToOne(() => Course)
  course: Course

  @ManyToOne(() => User)
  user: User
}
