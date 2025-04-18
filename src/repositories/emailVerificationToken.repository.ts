import { BaseRepository } from '~/core/repository/base.repository'
import { EmailVerificationToken } from '~/entities/emailVerificationToken.entity'
import { getRepository } from '~/services/database.service'

class EmailVerificationTokenRepository extends BaseRepository<EmailVerificationToken> {}

export const emailVerificationTokenRepository = new EmailVerificationTokenRepository(
  getRepository(EmailVerificationToken)
)
