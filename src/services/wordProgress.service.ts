import { EntityManager } from 'typeorm'
import { CreateWordProgressBodyReq } from '~/dto/req/wordProgress/createWordProgressBody.req'
import { WordProgress } from '~/entities/wordProgress.entity'
import { wordProgressRepository } from '~/repositories/wordProgress.repository'

class WordProgressService {
  createWordProgress = async (wordProgressData: CreateWordProgressBodyReq, manager?: EntityManager) => {
    const items = wordProgressData.wordProgress.map((progress) =>
      WordProgress.createWordProgress({ userId: wordProgressData.userId, wordId: progress.id as number })
    )

    const repo = manager?.getRepository(WordProgress) ?? wordProgressRepository

    return await repo.save(items)
  }

  // updateWordProgress =
}

export const wordProgressService = new WordProgressService()
