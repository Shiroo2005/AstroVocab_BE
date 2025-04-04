export interface CreateUserBodyReq {
  email: string
  username: string
  password: string
  fullName: string
  avatar?: string
  roleId: number
}
