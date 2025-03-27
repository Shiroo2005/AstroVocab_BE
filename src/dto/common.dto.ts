import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/tokenType'
import { UserStatus } from '~/constants/userStatus'

export interface TokenPayload extends JwtPayload {
  userId: number
  tokenType: TokenType
  status: UserStatus
  exp: number
}
