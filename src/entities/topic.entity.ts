import { IsEnum, IsNotEmpty, IsOptional, IsUrl, Length } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { TopicType } from '~/constants/topic'
import { Word } from './word.entity'

@Entity()
export class Topic {
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

  @Column('varchar', { default: 'N/A' })
  @IsOptional()
  thumbnail?: string

  @Column('varchar', { default: TopicType.FREE })
  @IsEnum(TopicType, { message: 'topic must be in enum TopicType' })
  @IsOptional()
  type?: TopicType

  //foreign key
  @ManyToMany(() => Word, { cascade: true })
  @JoinTable({ name: 'word_topic' })
  words?: Word[]

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  static create = ({ title, description, thumbnail, type, words, id }: Topic) => {
    const newTopic = new Topic()
    newTopic.id = id
    newTopic.title = title
    newTopic.thumbnail = thumbnail
    newTopic.description = description
    newTopic.type = type
    newTopic.words = words

    return newTopic
  }

  static update = (
    topic: Topic,
    {
      title,
      description,
      thumbnail,
      type,
      words
    }: {
      title?: string
      description?: string
      thumbnail?: string
      type?: TopicType
      words?: Word[]
    }
  ) => {
    if (title) topic.title = title
    if (description) topic.description = description
    if (thumbnail) topic.thumbnail = thumbnail
    if (type) topic.type = type
    if (words) topic.words = words

    return topic
  }

  static allowSortList = ['title', 'description', 'type']
}
