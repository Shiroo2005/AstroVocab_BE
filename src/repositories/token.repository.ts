import { FindOptionsWhere, Repository } from 'typeorm'
import { Token } from '~/entities/token.entity'
import { unGetData } from '~/utils'
import { validateClass } from '~/utils/validate'

class TokenRepository {
  tokenRepo: Repository<Token>

  constructor() {
    this.init()
  }

  private async init() {
    const { DatabaseService } = await import('~/services/database.service.js')
    this.tokenRepo = await DatabaseService.getInstance().getRepository(Token)
  }

  async saveOne({ user, refreshToken }: Token) {
    const token = Token.create({ user, refreshToken: refreshToken as string })
    //class validator
    await validateClass(token)

    return await this.tokenRepo.save(token)
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

  async hardDelete({ conditions }: { conditions: Partial<Token> }) {
    return await this.tokenRepo.delete({
      ...conditions
    })
  }
}

export const tokenRepository = new TokenRepository()
