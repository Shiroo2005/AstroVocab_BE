import { UserStatus } from '~/constants/userStatus'

export interface findUserQueryReq {
  page?: number
  limit?: number
  email?: string
  fullName?: string
  roleName?: string
  status?: UserStatus
}
