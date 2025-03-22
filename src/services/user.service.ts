import { LoginBodyReq } from '~/dto/req/auth/loginBody.req'
import { RegisterBodyReq } from '~/dto/req/auth/registerBody.req'
import { User } from '~/entities/user.entity'

class UserService {
  login = async ({ username, password }: LoginBodyReq) => {
    return {}
  }

  register = async ({ email, username, fullName, password }: RegisterBodyReq) => {
    const createdUser = await User.create({ email, username, password, fullName: fullName })

    return createdUser
  }
}

export const userService = new UserService()
