import { FindOptionsWhere, Repository } from 'typeorm'
import { Token } from '~/entities/token.entity'
import { DatabaseService } from '~/services/database.service'
import { unGetData } from '~/utils'

class TokenRepository {
  tokenRepo: Repository<Token>

  constructor() {
    this.init()
  }

  private async init() {
    this.tokenRepo = await DatabaseService.getInstance().getRepository(Token)
  }

  async saveOne({ user, refreshToken }: Partial<Token>) {
    return await this.tokenRepo.save({
      user,
      refreshToken
    })
  }

  async findOne({
    where,
    unGetFields,
    relations
  }: {
    where: FindOptionsWhere<Token> | FindOptionsWhere<Token>[]
    unGetFields?: string[]
    relations?: string[]
  }) {
    const foundUser = await this.tokenRepo.findOne({
      where,
      relations
    })

    if (!foundUser) return null

    return unGetData({ fields: unGetFields, object: foundUser })
  }
}

export const tokenRepository = new TokenRepository()
