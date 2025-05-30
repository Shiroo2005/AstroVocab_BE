import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/token'
import { UserStatus } from '~/constants/userStatus'

export interface TokenPayload extends JwtPayload {
  userId: number
  tokenType: TokenType
  exp: number
  roleId: number
}
