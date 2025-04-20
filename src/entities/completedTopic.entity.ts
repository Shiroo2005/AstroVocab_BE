import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Topic } from './topic.entity'
import { User } from './user.entity'

@Entity()
@Index(['user', 'topic'], { unique: true })
export class CompletedTopic {
  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'userId' })
  user: User

  @ManyToOne(() => Topic)
  topic: Topic

  @CreateDateColumn()
  createdAt?: Date

  @DeleteDateColumn()
  deletedAt?: Date
}
