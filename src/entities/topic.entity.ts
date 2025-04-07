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
import { WordPosition, WordRank } from '~/constants/word'
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
}
