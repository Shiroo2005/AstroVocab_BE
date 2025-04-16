import { RoleName } from '~/constants/access'
import { UserStatus } from '~/constants/userStatus'
import { TokenPayload } from '~/dto/common.dto'
import { LogoutBodyReq } from '~/dto/req/auth/logoutBody.req'
import { RegisterBodyReq } from '~/dto/req/auth/registerBody.req'
import { Role } from '~/entities/role.entity'
import { Token } from '~/entities/token.entity'
import { User } from '~/entities/user.entity'
import { unGetData } from '~/utils'
import { signAccessToken, signRefreshToken } from '~/utils/jwt'
import { BadRequestError } from '~/core/error.response'
import { tokenRepository } from '~/repositories/token.repository'
import { roleRepository } from '~/repositories/role.repository'
import { userRepository } from '~/repositories/user.repository'

class AuthService {
  login = async ({ userId, status, role }: { userId: number; status: UserStatus; role: Role }) => {
    // create access, refresh token
    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ userId, status, roleId: role.id as number }),
      signRefreshToken({ userId, status, roleId: role.id as number })
    ])

    // save refreshToken
    const token = new Token()
    token.refreshToken = refreshToken
    token.user = { id: userId } as User
    await tokenRepository.save(token)

    return {
      accessToken,
      refreshToken
    }
  }

  register = async ({ email, username, fullName, password }: RegisterBodyReq) => {
    const userRole = (await roleRepository.findOne({ name: RoleName.USER })) as Role | null

    if (!userRole) throw new BadRequestError('Role user not exist!')
    const createdUser = await userRepository.save({
      email,
      username,
      password,
      fullName,
      role: { id: userRole.id } as Role
    })

    return unGetData({ fields: ['password'], object: createdUser })
  }

  logout = async ({ refreshToken }: LogoutBodyReq) => {
    // delete refresh token in db
    const result = await tokenRepository.delete({ refreshToken })

    return result
  }

  newToken = async ({ userId, exp, status, roleId }: TokenPayload) => {
    // recreate token
    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ userId: userId, status, roleId }),
      signRefreshToken({ userId: userId, status, exp, roleId })
    ])

    // save refreshToken
    await tokenRepository.save({ user: { id: userId } as User, refreshToken })

    return { accessToken, refreshToken }
  }

  getAccount = async ({ userId }: TokenPayload) => {
    const foundUser = await userRepository.findOne(
      { id: userId },
      {
        relations: ['role'],
        select: {
          id: true,
          username: true,
          avatar: true,
          email: true,
          fullName: true,
          role: {
            name: true
          }
        }
      }
    )

    if (!foundUser) return {}
    return foundUser
  }
}

export const authService = new AuthService()
