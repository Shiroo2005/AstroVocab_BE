import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
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
@Index(['email', 'username'])
export class User {
  @PrimaryGeneratedColumn()
  id?: number

  @Column('varchar', { unique: true })
  email!: string

  @Column('varchar', { unique: true })
  username!: string

  @Column('varchar')
  password!: string

  @Column('nvarchar')
  fullName!: string

  @Column('varchar', { default: 'N/A' })
  avatar?: string

  @Column({ default: UserStatus.NOT_VERIFIED, type: 'varchar' })
  status?: UserStatus

  @Column('int', { default: 0 })
  streak?: number

  @Column('timestamp', { default: null })
  lastStudyDate?: Date

  @Column('int', { default: 0 })
  totalStudyDay?: number

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
  static create = ({
    id,
    email,
    username,
    fullName,
    password,
    avatar,
    status,
    role,
    tokens,
    lastStudyDate,
    streak,
    totalStudyDay
  }: User) => {
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
    newUser.lastStudyDate = lastStudyDate
    newUser.totalStudyDay = totalStudyDay
    newUser.streak = streak

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
      tokens,
      lastStudyDate,
      streak,
      totalStudyDay
    }: {
      email?: string
      username?: string
      fullName?: string
      avatar?: string
      status?: UserStatus
      role?: Role
      tokens?: RefreshToken[]
      totalStudyDay?: number
      lastStudyDate?: Date
      streak?: number
    }
  ) => {
    if (email) user.email = email
    if (username) user.username = username
    if (fullName) user.fullName = fullName
    if (avatar) user.avatar = avatar
    if (status) user.status = status
    if (role && role.id) user.role = role
    if (tokens && tokens.length == 0) user.tokens = tokens
    if (totalStudyDay) user.totalStudyDay = totalStudyDay
    if (lastStudyDate) user.lastStudyDate = lastStudyDate
    if (streak) user.streak = streak

    return user
  }

  static allowSortList = ['id', 'username', 'email', 'fullName']
}
