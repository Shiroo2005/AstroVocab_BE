import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { WordPosition, WordRank } from '~/constants/word'
import { WordTopic } from './wordTopic.entity'

@Entity()
export class Word {
  @PrimaryGeneratedColumn()
  id?: number

  @Column('varchar')
  content!: string

  @Column('varchar')
  pronunciation!: string

  @Column('varchar', { default: WordPosition.OTHERS })
  position?: WordPosition

  @Column('nvarchar')
  meaning!: string

  @Column('varchar', { default: 'N/A' })
  audio?: string

  @Column('varchar', { default: 'N/A' })
  image?: string

  @Column('varchar', { default: WordRank.A1 })
  rank?: WordRank

  @Column('varchar', { default: 'N/A' })
  example?: string

  @Column('nvarchar', { default: 'N/A' })
  translateExample?: string

  //foreign key
  @OneToMany(() => WordTopic, (wordTopic) => wordTopic.word)
  wordTopics?: WordTopic[]

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  static create = ({
    id,
    content,
    meaning,
    pronunciation,
    audio,
    image,
    rank,
    position,
    example,
    translateExample
  }: Word) => {
    const newWord = new Word()

    newWord.id = id
    newWord.content = content
    newWord.position = position
    newWord.pronunciation = pronunciation
    newWord.meaning = meaning
    newWord.audio = audio
    newWord.image = image
    newWord.rank = rank
    newWord.example = example
    newWord.translateExample = translateExample

    return newWord
  }

  static update = (
    word: Word,
    {
      content,
      meaning,
      pronunciation,
      audio,
      image,
      rank,
      position,
      example,
      translateExample
    }: {
      content?: string
      pronunciation?: string
      meaning?: string
      position?: WordPosition
      audio?: string
      image?: string
      rank?: WordRank
      example?: string
      translateExample?: string
    }
  ) => {
    if (content) word.content = content
    if (meaning) word.meaning = meaning
    if (pronunciation) word.pronunciation = pronunciation
    if (audio) word.audio = audio
    if (image) word.image = image
    if (rank) word.rank = rank
    if (position) word.position = position
    if (example) word.example = example
    if (translateExample) word.translateExample = translateExample

    return word
  }

  static allowSortList = [
    'id',
    'content',
    'pronunciation',
    'position',
    'meaning',
    'rank',
    'example',
    'translateExample'
  ]
}
