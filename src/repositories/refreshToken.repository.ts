import { BaseRepository } from '~/core/repository/base.repository'
import { RefreshToken } from '~/entities/refreshToken.entity'
import { getRepository } from '~/services/database.service'

class RefreshTokenRepository extends BaseRepository<RefreshToken> {
  findOneByTokenAndJoinUserAndRole = async ({
    refreshToken,
    selectFields
  }: {
    refreshToken: string
    selectFields: string[]
  }) => {
    return (await refreshTokenRepository
      .getQueryBuilder('refreshToken')
      .where('refreshToken.token = :refreshToken', { refreshToken })
      .select(selectFields)
      .leftJoin('refreshToken.user', 'user')
      .leftJoin('user.role', 'role')
      .execute()) as RefreshToken[] | null
  }
}

export const refreshTokenRepository = new RefreshTokenRepository(getRepository(RefreshToken))
