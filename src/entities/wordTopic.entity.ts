import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Topic } from './topic.entity'
import { Word } from './word.entity'

@Entity()
export class WordTopic extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  //foreign key
  @ManyToOne(() => Word)
  word?: Word

  @ManyToOne(() => Topic)
  topic: Topic

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}
