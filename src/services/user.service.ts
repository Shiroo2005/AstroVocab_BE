import { RoleName } from '~/constants/access'
import { UserStatus } from '~/constants/userStatus'
import { TokenPayload } from '~/dto/common.dto'
import { LogoutBodyReq } from '~/dto/req/auth/logoutBody.req'
import { RegisterBodyReq } from '~/dto/req/auth/registerBody.req'
import { Role } from '~/entities/role.entity'
import { Token } from '~/entities/token.entity'
import { User } from '~/entities/user.entity'
import { roleRepository } from '~/repositories/role.repository'
import { userRepository } from '~/repositories/user.repository'
import { unGetData } from '~/utils'
import { hashData, signAccessToken, signRefreshToken } from '~/utils/jwt'

class UserService {
  login = async ({ userId, status, roleId }: { userId: number; status: UserStatus; roleId: number }) => {
    // create access, refresh token
    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ userId, status, roleId }),
      signRefreshToken({ userId, status, roleId })
    ])

    // save refreshToken
    await Token.create({ userId, refreshToken })

    return {
      accessToken,
      refreshToken
    }
  }

  register = async ({ email, username, fullName, password }: RegisterBodyReq) => {
    const userRole = await roleRepository.findOneRole({ condition: { name: RoleName.USER } })

    const createdUser = await User.create({
      email,
      username,
      password: hashData(password),
      fullName: fullName,
      roleId: (userRole as Role).id as number
    })

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

  newToken = async ({ userId, exp, status, roleId }: TokenPayload) => {
    // recreate token
    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ userId: userId, status, roleId }),
      signRefreshToken({ userId: userId, status, exp, roleId })
    ])

    // save refreshToken
    await Token.create({ userId: userId, refreshToken })

    return { accessToken, refreshToken }
  }

  getAccount = async ({ userId }: TokenPayload) => {
    const foundUser = await userRepository.findOneUser({ condition: { id: userId }, unGetFields: ['password'] })

    if (!foundUser) return {}
    return foundUser
  }
}

export const userService = new UserService()
