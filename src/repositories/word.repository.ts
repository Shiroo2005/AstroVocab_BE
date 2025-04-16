import { BaseRepository } from '~/core/repository/base.repository'
import { Word } from '~/entities/word.entity'
import { getRepository } from '~/services/database.service'

class WordRepository extends BaseRepository<Word> {}

export const wordRepository = new WordRepository(getRepository(Word))
