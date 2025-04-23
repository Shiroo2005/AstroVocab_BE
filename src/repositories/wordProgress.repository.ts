import { WORD_MASTERY_LEVEL } from '~/constants/userProgress'
import { BaseRepository } from '~/core/repository/base.repository'
import { WordProgress } from '~/entities/wordProgress.entity'
import { getRepository } from '~/services/database.service'

class WordRepository extends BaseRepository<WordProgress> {
  getWordProgressAndGroupByMasteryLevel = async ({ userId }: { userId: number }) => {
    const rawResult = await wordProgressRepository
      .getRepo()
      .createQueryBuilder('wp')
      .select('wp.masteryLevel', 'masteryLevel')
      .addSelect('COUNT(*)', 'count')
      .where('wp.userId = :userId', { userId })
      .groupBy('wp.masteryLevel')
      .getRawMany()
    return rawResult.map((row) => ({
      masteryLevel: row.masteryLevel as WORD_MASTERY_LEVEL,
      count: Number(row.count)
    }))
  }
}

export const wordProgressRepository = new WordRepository(getRepository(WordProgress))
