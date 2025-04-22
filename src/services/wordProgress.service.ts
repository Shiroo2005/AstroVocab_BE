import { EntityManager } from 'typeorm'
import {
  DEFAULT_EASE_FACTOR,
  LEVEL_UP_FOR_EACH_LEVEL,
  MAX_EASE_FACTOR,
  WORD_MASTERY_LEVEL
} from '~/constants/userProgress'
import { CreateWordProgressBodyReq } from '~/dto/req/wordProgress/createWordProgressBody.req'
import { UpdateWordProgressBodyReq, UpdateWordProgressData } from '~/dto/req/wordProgress/updateWordProgressBody.req'
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

  updateWordProgress = async ({ words }: { words: UpdateWordProgressData[] }) => {
    const _wordProgress: WordProgress[] = words
      .map((wordBody) => {
        const { newEaseFactor, newLevel } = this.calculateProgressByWrongCount(
          wordBody.word.masteryLevel,
          wordBody.word.easeFactor,
          wordBody.wrongCount
        )

        console.log(wordBody)

        //mapping data
        const wordProgress = wordBody.word
        wordProgress.easeFactor = newEaseFactor
        wordProgress.masteryLevel = newLevel
        wordProgress.nextReviewDate = WordProgress.calculateReviewDate(wordProgress.easeFactor, wordBody.reviewedDate)
        wordProgress.reviewCount += 1

        return wordProgress
      })
      .filter((wordBody) => wordBody.easeFactor < MAX_EASE_FACTOR)

    return await wordProgressRepository.save(_wordProgress)
  }

  calculateProgressByWrongCount = (
    currentLevel: WORD_MASTERY_LEVEL,
    currentEaseFactor: number,
    wrongCount: number
  ): { newEaseFactor: number; newLevel: WORD_MASTERY_LEVEL } => {
    let newEaseFactor = currentEaseFactor
    let newLevel = currentLevel

    // check if easefactore is lower than min easefactor for this level will descrease this level
    switch (currentLevel) {
      case WORD_MASTERY_LEVEL.MASTERED:
        if (wrongCount > LEVEL_UP_FOR_EACH_LEVEL.MASTERED.maxWrong) {
          newEaseFactor = currentEaseFactor - 1
          if (newEaseFactor < LEVEL_UP_FOR_EACH_LEVEL.MASTERED.easeFactorForLevelUp)
            newLevel = WORD_MASTERY_LEVEL.REVIEWING
        } else {
          newEaseFactor = currentEaseFactor + 1
        }
        break

      case WORD_MASTERY_LEVEL.REVIEWING:
        if (wrongCount > LEVEL_UP_FOR_EACH_LEVEL.REVIEWING.maxWrong) {
          newEaseFactor = currentEaseFactor - 1
          if (newEaseFactor < LEVEL_UP_FOR_EACH_LEVEL.REVIEWING.easeFactorForLevelUp)
            newLevel = WORD_MASTERY_LEVEL.LEARNING
        } else {
          newEaseFactor = currentEaseFactor + 1
          if (newEaseFactor >= LEVEL_UP_FOR_EACH_LEVEL.MASTERED.easeFactorForLevelUp)
            newLevel = WORD_MASTERY_LEVEL.MASTERED
        }
        break

      case WORD_MASTERY_LEVEL.LEARNING:
        if (wrongCount > LEVEL_UP_FOR_EACH_LEVEL.LEARNING.maxWrong) {
          newEaseFactor = currentEaseFactor - 1
          if (newEaseFactor < LEVEL_UP_FOR_EACH_LEVEL.LEARNING.easeFactorForLevelUp) newLevel = WORD_MASTERY_LEVEL.NEW
        } else {
          newEaseFactor = currentEaseFactor + 1
          if (newEaseFactor >= LEVEL_UP_FOR_EACH_LEVEL.REVIEWING.easeFactorForLevelUp)
            newLevel = WORD_MASTERY_LEVEL.REVIEWING
        }
        break

      case WORD_MASTERY_LEVEL.NEW:
        if (wrongCount > LEVEL_UP_FOR_EACH_LEVEL.NEW.maxWrong) {
          newEaseFactor = Math.max(currentEaseFactor - 1, DEFAULT_EASE_FACTOR)
          // if(newEaseFactor < LEVEL_UP_FOR_EACH_LEVEL.NEW.easeFactorForLevelUp) newLevel = WORD_MASTERY_LEVEL.NEW
        } else {
          newEaseFactor = currentEaseFactor + 1
          if (newEaseFactor >= LEVEL_UP_FOR_EACH_LEVEL.LEARNING.easeFactorForLevelUp)
            newLevel = WORD_MASTERY_LEVEL.LEARNING
        }
        break
      default:
        newLevel = WORD_MASTERY_LEVEL.NEW
    }
    return {
      newEaseFactor,
      newLevel
    }
  }
}

export const wordProgressService = new WordProgressService()
