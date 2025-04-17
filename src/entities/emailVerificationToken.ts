import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'

@Entity()
export class EmailVerificationToken {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Index({ unique: true })
  token: string

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User

  @Column({ type: 'timestamp' })
  expiresAt: Date

  @CreateDateColumn()
  createdAt: Date
}
