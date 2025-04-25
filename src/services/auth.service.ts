import { RoleName } from '~/constants/access'
import { UserStatus } from '~/constants/userStatus'
import { TokenPayload } from '~/dto/common.dto'
import { LogoutBodyReq } from '~/dto/req/auth/logoutBody.req'
import { RegisterBodyReq } from '~/dto/req/auth/registerBody.req'
import { Role } from '~/entities/role.entity'
import { User } from '~/entities/user.entity'
import { signAccessToken, signRefreshToken } from '~/utils/jwt'
import { BadRequestError } from '~/core/error.response'
import { refreshTokenRepository } from '~/repositories/refreshToken.repository'
import { roleRepository } from '~/repositories/role.repository'
import { userRepository } from '~/repositories/user.repository'
import { sendVerifyEmail } from './email.service'
import { emailVerificationTokenRepository } from '~/repositories/emailVerificationToken.repository'
import { EmailVerificationToken } from '~/entities/emailVerificationToken.entity'
import { RegisterRes } from '~/dto/res/auth/register.res'
import { LoginRes } from '~/dto/res/auth/login.res'
import { NewTokenRes } from '~/dto/res/auth/newToken.res'
import { getAccountRes } from '~/dto/res/auth/getAccount.res'
import { roleService } from './role.service'

class AuthService {
  login = async ({ userId, role }: { userId: number; role: Role }): Promise<LoginRes> => {
    const { accessToken, refreshToken } = await this.createAccessAndRefreshToken({
      roleId: role.id as number,
      userId
    })

    return { accessToken, refreshToken }
  }

  register = async ({ email, username, fullName, password }: RegisterBodyReq): Promise<RegisterRes> => {
    /**
     * @Process Register
     * @B1 : Create user and save in db
     * @B2 : Send verify email by resend with email service
     */

    //B1 create user with role USER
    const userRole = (await roleRepository.findOne({ name: RoleName.USER })) as Role | null

    if (!userRole) throw new BadRequestError('Role user not exist!')
    const createdUser = await userRepository.save({
      email,
      username,
      password,
      fullName,
      role: { id: userRole.id } as Role
    })

    //B2 send verify email
    void this.sendVerifyEmail({ email, name: fullName, userId: createdUser[0].id as number })

    // create access, refresh token
    const userId = createdUser[0].id as number

    const { accessToken, refreshToken } = await this.createAccessAndRefreshToken({
      userId,
      roleId: userRole.id as number
    })
    return { accessToken, refreshToken }
  }

  sendVerifyEmail = async ({ email, userId, name }: { email: string; userId: number; name: string }) => {
    //found role USER
    const role = await roleService.getRoleByName(RoleName.USER)

    const token = await sendVerifyEmail({
      to: email,
      template: 'welcome',
      body: { name, userId, roleId: role.id as number }
    })

    const emailToken = {
      token,
      user: {
        id: userId,
        role: {
          id: role.id
        }
      }
    } as EmailVerificationToken
    await emailVerificationTokenRepository.save(emailToken)

    return {}
  }

  logout = async ({ refreshToken }: LogoutBodyReq) => {
    // delete refresh token in db
    const result = await refreshTokenRepository.delete({ token: refreshToken })

    return result
  }

  newToken = async ({ userId, roleId }: { userId: number; roleId: number }): Promise<NewTokenRes> => {
    //only create access token
    const accessToken = await signAccessToken({ userId, roleId })

    return { accessToken }
  }

  getAccount = async ({ user }: { user: User }): Promise<getAccountRes | object> => {
    return user
  }

  verifyEmail = async ({ userId, roleId }: { userId: number; roleId: number }) => {
    //set status user in db
    await userRepository.update(userId, { status: UserStatus.VERIFIED })

    //only create access token
    const accessToken = await signAccessToken({ userId, roleId })

    return { accessToken }
  }

  createAccessAndRefreshToken = async ({ userId, roleId }: { userId: number; roleId: number }) => {
    // create access, refresh token
    const [accessToken, refreshToken] = await Promise.all([signAccessToken({ userId, roleId }), signRefreshToken()])

    // save refreshToken
    await refreshTokenRepository.insert({ token: refreshToken, user: { id: userId } })

    return { accessToken, refreshToken }
  }
}

export const authService = new AuthService()
