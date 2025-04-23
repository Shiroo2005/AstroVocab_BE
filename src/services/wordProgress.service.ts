import { now } from 'lodash'
import { EntityManager, LessThan } from 'typeorm'
import {
  DEFAULT_EASE_FACTOR,
  LEVEL_UP_FOR_EACH_LEVEL,
  MAX_EASE_FACTOR,
  WORD_MASTERY_LEVEL
} from '~/constants/userProgress'
import { CreateWordProgressBodyReq } from '~/dto/req/wordProgress/createWordProgressBody.req'
import { UpdateWordProgressData } from '~/dto/req/wordProgress/updateWordProgressBody.req'
import { SummaryUserRes } from '~/dto/res/wordProgress/summaryUser'
import { WordProgress } from '~/entities/wordProgress.entity'
import { wordProgressRepository } from '~/repositories/wordProgress.repository'
import { getEnumLabels } from '~/utils'

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
          wordBody.wrongCount || 0
        )

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

  createOrUpdateWordProgress = async (wordProgressData: CreateWordProgressBodyReq, manager?: EntityManager) => {
    const nowTime = new Date(now())
    const items = await Promise.all(
      wordProgressData.wordProgress.map(async (word) => {
        // check if word is already learn by user
        const foundWordProgress = await wordProgressRepository.findOne({
          word: {
            id: word.id
          },
          user: {
            id: wordProgressData.userId
          }
        })

        if (foundWordProgress) {
          const { newEaseFactor, newLevel } = this.calculateProgressByWrongCount(
            foundWordProgress.masteryLevel,
            foundWordProgress.easeFactor,
            0
          )
          //mapping data
          foundWordProgress.easeFactor = newEaseFactor
          foundWordProgress.masteryLevel = newLevel
          foundWordProgress.nextReviewDate = WordProgress.calculateReviewDate(foundWordProgress.easeFactor, nowTime)
          foundWordProgress.reviewCount += 1

          return foundWordProgress
        } else {
          return WordProgress.createWordProgress({ userId: wordProgressData.userId, wordId: word.id as number })
        }
      })
    )
    const repo = manager?.getRepository(WordProgress) ?? wordProgressRepository

    return await repo.save(items)
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

  getWordReview = async ({ userId }: { userId: number }) => {
    const wordReview = await wordProgressRepository.findAll({
      where: {
        user: {
          id: userId
        },
        nextReviewDate: LessThan(new Date(now()))
      },
      relations: ['word'],
      select: {
        word: {
          id: true,
          content: true,
          position: true,
          meaning: true,
          audio: true,
          image: true,
          pronunciation: true,
          example: true,
          translateExample: true,
          rank: true
        }
      }
    })

    return wordReview
  }

  getSummary = async ({ userId }: { userId: number }) => {
    const rawResult = await wordProgressRepository.getWordProgressAndGroupByMasteryLevel({ userId })
    const totalLearnWord = rawResult.reduce((sum, item) => sum + Number(item.count), 0)

    //mapping raw to {masteryLevel, count}
    const countWordWithEachLevel = getEnumLabels(WORD_MASTERY_LEVEL).map((level) => {
      return {
        level: level,
        wordCount:
          rawResult.find((r) => r.masteryLevel === WORD_MASTERY_LEVEL[level as keyof typeof WORD_MASTERY_LEVEL])
            ?.count ?? 0
      }
    })

    return {
      statistics: countWordWithEachLevel,
      totalLearnWord
    } as SummaryUserRes
  }
}

export const wordProgressService = new WordProgressService()
