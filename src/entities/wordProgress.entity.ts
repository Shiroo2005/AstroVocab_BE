import { IsDate } from 'class-validator'
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { User } from './user.entity'
import { Word } from './word.entity'
import { WORD_MASTERY_LEVEL } from '~/constants/userProgress'

@Entity()
export class WordProgress extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @Column('varchar', { default: WORD_MASTERY_LEVEL.NEW })
  masteryLevel: WORD_MASTERY_LEVEL

  @Column('int')
  interval: number

  @Column('int', { default: 0 })
  easeFactor: number

  @Column('date')
  reviewCount!: Date

  @Column('datetime')
  @IsDate({ message: 'Invalid next review date' })
  nextReviewDate!: Date

  @ManyToOne(() => User)
  user: User

  @ManyToOne(() => Word)
  word: Word

  @UpdateDateColumn()
  updatedAt?: Date

  @CreateDateColumn()
  createAt?: Date

  static createWordProgress = ({
    masteryLevel,
    user,
    word,
    easeFactor,
    interval,
    nextReviewDate,
    reviewCount
  }: WordProgress) => {
    const newWordProgress = new WordProgress()

    newWordProgress.user = user
    newWordProgress.word = word
    newWordProgress.masteryLevel = masteryLevel
    newWordProgress.easeFactor = easeFactor
    newWordProgress.interval = interval
    newWordProgress.nextReviewDate = nextReviewDate
    newWordProgress.reviewCount = reviewCount

    return newWordProgress
  }

  static updateWordProgress = (
    wordProgress: WordProgress,
    { easeFactor, interval, masteryLevel, nextReviewDate, reviewCount }: WordProgress
  ) => {
    if (easeFactor) wordProgress.easeFactor = easeFactor
    if (interval) wordProgress.interval = interval
    if (masteryLevel) wordProgress.masteryLevel = masteryLevel
    if (nextReviewDate) wordProgress.nextReviewDate = nextReviewDate
    if (reviewCount) wordProgress.reviewCount = reviewCount

    return wordProgress
  }
}
