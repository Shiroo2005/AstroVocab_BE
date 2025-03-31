import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { UserStatus } from '~/constants/userStatus'
import { Role } from './role.entity'
import { Token } from './token.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number

  @Column()
  @IsEmail()
  @IsNotEmpty()
  email!: string

  @Column()
  @Length(5, 20, { message: `Username's length must be between 5 and 20!` })
  @IsNotEmpty()
  username!: string

  @Column()
  @Matches(/^(?=.*[A-Z]).{6,}$/, { message: 'Password must contain at least 6 chars, 1 uppercase!' })
  @IsNotEmpty()
  password!: string

  @Column()
  @Matches(/^(?=(?:.*\p{L}){3})[\p{L}0-9 \-']+$/u, {
    message: 'Full name must contain at least 3 letters and only letters, numbers, some symbols!'
  })
  @IsNotEmpty()
  fullName!: string

  @Column()
  @IsNotEmpty()
  avatar!: string

  @Column({ default: UserStatus.NOT_VERIFIED })
  @IsNotEmpty()
  status!: UserStatus

  @ManyToOne(() => Role, (role) => role.users)
  role?: Role

  @OneToMany(() => Token, (token) => token.user)
  tokens?: Token[]

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}
