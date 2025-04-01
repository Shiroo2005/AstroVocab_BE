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
import { IsNotEmpty } from 'class-validator'
import { Role } from './role.entity'

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id?: number

  @Column('text')
  @IsNotEmpty()
  resource!: Resource

  @Column('text')
  @IsNotEmpty()
  action!: Action

  @ManyToMany(() => Role, (role) => role.permissions)
  roles?: Role[]

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  static create = ({ action, resource, roles }: Permission) => {
    const newPermission = new Permission()

    newPermission.action = action as Action
    newPermission.resource = resource as Resource
    newPermission.roles = roles

    return newPermission
  }
}
