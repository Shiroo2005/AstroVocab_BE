import { IsEnum, IsNotEmpty, IsOptional, IsUrl, Length } from 'class-validator'
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { WordPosition, WordRank } from '~/constants/word'

@Entity()
export class Word {
  @PrimaryGeneratedColumn()
  id?: number

  @Column('varchar')
  @IsNotEmpty({ message: 'Content must be a not empty string!' })
  @Length(1, 255, { message: 'Content must be between 1 and 255 chars long!' })
  content!: string

  @Column('varchar')
  @IsNotEmpty({ message: 'Pronunciation must be a not empty string!' })
  @Length(1, 255, { message: 'Content must be between 1 and 255 chars long!' })
  pronunciation!: string

  @Column('varchar', { default: WordPosition.Others })
  @IsEnum(WordPosition, { message: 'position must be in enum WordPosition' })
  position?: WordPosition

  @Column('nvarchar')
  @IsNotEmpty({ message: 'Meaning must be a not empty string!' })
  @Length(1, 255, { message: 'Content must be between 1 and 255 chars long!' })
  meaning!: string

  @Column('varchar', { default: 'N/A' })
  @IsOptional()
  @IsUrl({}, { message: 'Audio must be a valid URL or "N/A"!' })
  audio?: string

  @Column('varchar', { default: 'N/A' })
  @IsOptional()
  @IsUrl({}, { message: 'Image must be a valid URL or "N/A"!' })
  image?: string

  @Column('varchar', { default: WordRank.A1 })
  @IsEnum(WordRank, { message: 'position must be in enum WordPosition' })
  @IsOptional()
  rank?: WordRank

  @Column('varchar', { default: 'N/A' })
  @IsOptional()
  @Length(1, 255, { message: 'Example must be between 1 and 255 chars long.' })
  example?: string

  @Column('nvarchar', { default: 'N/A' })
  @IsOptional()
  @Length(1, 255, { message: 'Translate example must be between 1 and 255 characters long.' })
  translateExample?: string

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
}
