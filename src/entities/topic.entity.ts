import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { TopicType } from '~/constants/topic'
import { WordTopic } from './wordTopic.entity'

@Entity()
export class Topic {
  @PrimaryGeneratedColumn()
  id?: number

  @Column('varchar')
  title!: string

  @Column('varchar')
  description!: string

  @Column('varchar', { default: 'N/A' })
  thumbnail?: string

  @Column('varchar', { default: TopicType.FREE })
  type?: TopicType

  //foreign key
  @OneToMany(() => WordTopic, (wordTopic) => wordTopic.topic, { cascade: true })
  wordTopics?: WordTopic[]

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  static create = ({ title, description, thumbnail, type, wordTopics, id }: Topic) => {
    const newTopic = new Topic()
    newTopic.id = id
    newTopic.title = title
    newTopic.thumbnail = thumbnail
    newTopic.description = description
    newTopic.type = type
    newTopic.wordTopics = wordTopics
    return newTopic
  }

  static update = (
    topic: Topic,
    {
      title,
      description,
      thumbnail,
      type,
      wordTopics
    }: {
      title?: string
      description?: string
      thumbnail?: string
      type?: TopicType
      wordTopics?: WordTopic[]
    }
  ) => {
    if (title) topic.title = title
    if (description) topic.description = description
    if (thumbnail) topic.thumbnail = thumbnail
    if (type) topic.type = type
    if (wordTopics) topic.wordTopics = wordTopics

    return topic
  }

  static allowSortList = ['id', 'title', 'description', 'type']
}
