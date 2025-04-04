import { UserStatus } from '~/constants/userStatus'

export interface UpdateUserBodyReq {
  email?: string
  username?: string
  fullName?: string
  avatar?: string
  roleId: number
  status?: UserStatus
}
