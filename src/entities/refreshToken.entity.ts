import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { User } from './user.entity'

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id?: number

  @Column({ type: 'varchar', length: 512 })
  token!: string

  @ManyToOne(() => User, (user) => user.tokens, { cascade: true })
  user?: User

  @CreateDateColumn()
  createdAt?: Date

  static create = ({ token, user }: RefreshToken) => {
    const newToken = new RefreshToken()
    newToken.token = token
    newToken.user = user

    return newToken
  }
}
