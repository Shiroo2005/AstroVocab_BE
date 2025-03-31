import { Matches } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { User } from './user.entity'
import { Permission } from './permission.entity'

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id?: number

  @Column('nvarchar')
  @Matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9 ]{3,}$/, {
    message: 'Name must contain at least 3 chars, 1 letter and only letter, number'
  })
  name!: string

  @Column({ default: 'N/A', type: 'nvarchar' })
  description?: string

  @OneToMany(() => User, (user) => user.role)
  users?: User[]

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions!: Permission[]

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}
