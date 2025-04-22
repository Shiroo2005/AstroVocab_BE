import { BaseRepository } from '~/core/repository/base.repository'
import { WordProgress } from '~/entities/wordProgress.entity'
import { getRepository } from '~/services/database.service'

class WordRepository extends BaseRepository<WordProgress> {}

export const wordProgressRepository = new WordRepository(getRepository(WordProgress))
