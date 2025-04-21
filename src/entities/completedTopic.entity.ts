import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Topic } from './topic.entity'
import { User } from './user.entity'

@Entity()
@Index(['user', 'topic'], { unique: true })
export class CompletedTopic extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(() => User, (user) => user)
  user: User

  @ManyToOne(() => Topic)
  topic: Topic

  @Column({ type: 'int' })
  wordVersionAtCompletion: number

  @CreateDateColumn()
  createdAt?: Date

  @DeleteDateColumn()
  deletedAt?: Date
}
