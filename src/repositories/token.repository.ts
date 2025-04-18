import { BaseRepository } from '~/core/repository/base.repository'
import { RefreshToken } from '~/entities/refreshToken.entity'
import { getRepository } from '~/services/database.service'

class TokenRepository extends BaseRepository<RefreshToken> {}

export const tokenRepository = new TokenRepository(getRepository(RefreshToken))
