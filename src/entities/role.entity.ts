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

  @ManyToMany(() => Permission, { cascade: true })
  @JoinTable({ name: 'role_permission' })
  permissions?: Permission[]

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  static create = ({ name, permissions, description, users, id }: Role) => {
    const newRole = new Role()

    newRole.id = id
    newRole.name = name
    newRole.description = description
    newRole.users = users
    newRole.permissions = permissions

    return newRole
  }
}
