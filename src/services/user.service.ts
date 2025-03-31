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
import { databaseService } from './database.service'
import { BadRequestError } from '~/core/error.response'
import { tokenRepository } from '~/repositories/token.repository'

class UserService {
  login = async ({ userId, status, roleId }: { userId: number; status: UserStatus; roleId: number }) => {
    // create access, refresh token
    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ userId, status, roleId }),
      signRefreshToken({ userId, status, roleId })
    ])

    // save refreshToken
    const token = new Token()
    token.refreshToken = refreshToken
    token.user = { id: userId } as User
    await tokenRepository.saveOne(token)

    return {
      accessToken,
      refreshToken
    }
  }

  register = async ({ email, username, fullName, password }: RegisterBodyReq) => {
    const userRole = (await roleRepository.findOne({ conditions: { name: RoleName.USER } })) as Role | null

    if (!userRole) throw new BadRequestError('Role user not exist!')
    const createdUser = await userRepository.saveOne({
      email,
      username,
      password: hashData(password),
      fullName: fullName,
      role: { id: userRole.id } as Role
    })

    return unGetData({ fields: ['password'], object: createdUser })
  }

  logout = async ({ refreshToken }: LogoutBodyReq) => {
    // delete refresh token in db
    const result = await databaseService.getRepository(Token).softDelete({
      refreshToken
    })

    return result
  }

  newToken = async ({ userId, exp, status, roleId }: TokenPayload) => {
    // recreate token
    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ userId: userId, status, roleId }),
      signRefreshToken({ userId: userId, status, exp, roleId })
    ])

    // save refreshToken
    await tokenRepository.saveOne({ user: { id: userId } as User, refreshToken })

    return { accessToken, refreshToken }
  }

  getAccount = async ({ userId }: TokenPayload) => {
    const foundUser = await userRepository.findOne({ conditions: { id: userId }, unGetFields: ['password'] })

    if (!foundUser) return {}
    return foundUser
  }
}

export const userService = new UserService()
