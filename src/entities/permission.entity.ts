import { Action, Resource } from '~/constants/access'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Role } from './role.entity'

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id?: number

  @Column('text')
  resource!: Resource

  @Column('text')
  action!: Action

  @ManyToMany(() => Role, (role) => role.permissions)
  roles?: Role[]

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  static create = ({ id, action, resource, roles }: Permission) => {
    const newPermission = new Permission()

    newPermission.id = id
    newPermission.action = action
    newPermission.resource = resource
    newPermission.roles = roles

    return newPermission
  }
}
