import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'
import { IsNotEmpty } from 'class-validator'

@Entity()
export class EmailVerificationToken {
  @PrimaryGeneratedColumn()
  id?: number

  @Column({ type: 'varchar', length: 512 })
  @IsNotEmpty()
  token: string

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User

  @CreateDateColumn()
  createdAt?: Date
}
