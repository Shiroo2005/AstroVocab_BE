import { Repository } from 'typeorm'
import { Token } from '~/entities/token.entity'
import { databaseService } from '~/services/database.service'

class TokenRepository {
  tokenRepo: Repository<Token>

  constructor() {
    this.tokenRepo = databaseService.appDataSource.getRepository(Token)
  }

  async saveOne({ user, refreshToken }: Partial<Token>) {
    return await this.tokenRepo.save({
      user,
      refreshToken
    })
  }
}

export const tokenRepository = new TokenRepository()
