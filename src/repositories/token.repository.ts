import { BaseRepository } from '~/core/repository/base.repository'
import { Token } from '~/entities/token.entity'
import { getRepository } from '~/services/database.service'

class TokenRepository extends BaseRepository<Token> {}

export const tokenRepository = new TokenRepository(getRepository(Token))
