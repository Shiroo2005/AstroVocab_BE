import { UserStatus } from '~/constants/userStatus'

export interface getAccountRes {
  foundUser: {
    id: number
    username: string
    avatar: string
    email: string
    fullName: string
    role: {
      id: number
      name: string
    }
    status: UserStatus
  }
}
