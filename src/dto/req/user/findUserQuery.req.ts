import { FindOptionsOrder } from 'typeorm'
import { UserStatus } from '~/constants/userStatus'
import { User } from '~/entities/user.entity'

export interface findUserQueryReq {
  page?: number
  limit?: number
  email?: string
  fullName?: string
  username?: string
  roleName?: string
  status?: UserStatus
  sort?: FindOptionsOrder<User>
}
