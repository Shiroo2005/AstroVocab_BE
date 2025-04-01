import { IsEmail, IsNotEmpty, Length, Matches, validate } from 'class-validator'
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

  @Column('varchar', { unique: true })
  @IsEmail()
  @IsNotEmpty()
  email!: string

  @Column('varchar', { unique: true })
  @Length(5, 20, { message: `Username's length must be between 5 and 20!` })
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'Username contain only letter and number' })
  username!: string

  @Column('varchar')
  @Matches(/^(?=.*[A-Z]).{6,}$/, { message: 'Password must contain at least 6 chars, 1 uppercase!' })
  @IsNotEmpty()
  password!: string

  @Column('nvarchar')
  @Matches(/^(?=(?:.*\p{L}){3})[\p{L}0-9 \-']+$/u, {
    message: 'Full name must contain at least 3 letters and only letters, numbers, some symbols!'
  })
  @IsNotEmpty()
  fullName!: string

  @Column('varchar', { default: 'N/A' })
  avatar?: string

  @Column({ default: UserStatus.NOT_VERIFIED, type: 'varchar' })
  status?: UserStatus

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

  static create = ({ id, email, username, fullName, password, avatar, status, role, tokens }: User) => {
    const newUser = new User()

    newUser.id = id
    newUser.email = email
    newUser.username = username
    newUser.fullName = fullName
    newUser.password = password
    newUser.avatar = avatar
    newUser.status = status
    newUser.role = role
    newUser.tokens = tokens

    return newUser
  }
}
