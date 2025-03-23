import { UserStatus } from '~/constants/userStatus'
import { LogoutBodyReq } from '~/dto/req/auth/logoutBody.req'
import { RegisterBodyReq } from '~/dto/req/auth/registerBody.req'
import { Token } from '~/entities/token.entity'
import { User } from '~/entities/user.entity'
import { unGetData } from '~/utils'
import { hashData, signAccessToken, signRefreshToken } from '~/utils/jwt'

class UserService {
  login = async ({ userId, status }: { userId: number; status: UserStatus }) => {
    // create access, refresh token
    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ userId, status }),
      signRefreshToken({ userId, status })
    ])

    // save refreshToken
    await Token.create({ userId, refreshToken })

    return {
      accessToken,
      refreshToken
    }
  }

  register = async ({ email, username, fullName, password }: RegisterBodyReq) => {
    const createdUser = await User.create({ email, username, password: hashData(password), fullName: fullName })

    return unGetData({ fields: ['password'], object: createdUser.dataValues })
  }

  logout = async ({ refreshToken }: LogoutBodyReq) => {
    // delete refresh token in db
    await Token.destroy({
      where: {
        refreshToken
      }
    })

    return {}
  }
}

export const userService = new UserService()
