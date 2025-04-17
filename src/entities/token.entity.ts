import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { User } from './user.entity'
import { IsNotEmpty } from 'class-validator'

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id?: number

  @Column({ type: 'varchar', length: 1024 })
  @IsNotEmpty()
  refreshToken!: string

  @ManyToOne(() => User, (user) => user.tokens, { cascade: true })
  user?: User

  @CreateDateColumn()
  createdAt?: Date

  static create = ({ refreshToken, user }: Token) => {
    const newToken = new Token()
    newToken.refreshToken = refreshToken
    newToken.user = user

    return newToken
  }
}
