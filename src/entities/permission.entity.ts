import { Action, Resource } from '~/constants/access'
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { IsNotEmpty } from 'class-validator'

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id?: number

  @Column()
  @IsNotEmpty()
  resource!: Resource

  @Column()
  @IsNotEmpty()
  action!: Action

  @DeleteDateColumn()
  deletedAt?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}
