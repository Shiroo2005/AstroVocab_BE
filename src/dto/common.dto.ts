import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/tokenType'
import { UserStatus } from '~/constants/userStatus'

export interface TokenPayload extends JwtPayload {
  userId: string
  token_type: TokenType
  status: UserStatus
  exp: number
}
