import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { User } from './user.entity'
import { IsNotEmpty } from 'class-validator'

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id?: number

  @Column()
  @IsNotEmpty()
  refreshToken!: string

  @ManyToOne(() => User, (user) => user.tokens, { cascade: true })
  user?: User

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}
