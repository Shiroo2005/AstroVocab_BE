import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator'
import {
  BeforeInsert,
  BeforeUpdate,
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
import { RefreshToken } from './refreshToken.entity'
import { hashData } from '~/utils/jwt'

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
  role: Role

  @OneToMany(() => RefreshToken, (token) => token.user)
  tokens?: RefreshToken[]

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword?() {
    this.password = hashData(this.password)
  }
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

  static update = (
    user: User,
    {
      email,
      username,
      fullName,
      avatar,
      status,
      role,
      tokens
    }: {
      email?: string
      username?: string
      fullName?: string
      avatar?: string
      status?: UserStatus
      roleId?: number
      role?: Role
      tokens?: RefreshToken[]
    }
  ) => {
    if (email) user.email = email
    if (username) user.username = username
    if (fullName) user.fullName = fullName
    if (avatar) user.avatar = avatar
    if (status) user.status = status
    if (role && role.id) user.role = role
    if (tokens && tokens.length == 0) user.tokens = tokens

    return user
  }

  static allowSortList = ['id', 'username', 'email', 'fullName']
}
