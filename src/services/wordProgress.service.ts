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
import { User } from '~/entities/user.entity'
import { WordProgress } from '~/entities/wordProgress.entity'
import { userRepository } from '~/repositories/user.repository'
import { wordProgressRepository } from '~/repositories/wordProgress.repository'
import { getEnumLabels } from '~/utils'
import { AppDataSource } from './database.service'
import { BadRequestError } from '~/core/error.response'

class WordProgressService {
  createWordProgress = async (wordProgressData: CreateWordProgressBodyReq, manager?: EntityManager) => {
    const items = wordProgressData.wordProgress.map((progress) =>
      WordProgress.createWordProgress({ userId: wordProgressData.userId, wordId: progress.id as number })
    )

    const repo = manager?.getRepository(WordProgress) ?? wordProgressRepository

    return await repo.save(items)
  }

  updateWordProgress = async ({ words, userId }: { words: UpdateWordProgressData[]; userId: number }) => {
    const queryRunner = AppDataSource.createQueryRunner()

    await queryRunner.startTransaction()
    //start transaction
    try {
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

      const result = await wordProgressRepository.save(_wordProgress)

      await this.updateUserProgress({ userId, manager: queryRunner.manager })

      // commit transaction now:
      await queryRunner.commitTransaction()

      return result
    } catch (err) {
      await queryRunner.rollbackTransaction()
      console.log(`Error when handle update word progress: ${err}`)
      throw new BadRequestError(`${err}`)
    } finally {
      // you need to release query runner which is manually created:
      await queryRunner.release()
    }
    //end transaction
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

  updateUserProgress = async ({ userId, manager }: { userId: number; manager?: EntityManager }) => {
    const foundUser = (await userRepository.findOne({
      id: userId
    })) as User

    //update progress for this user
    //streak, last study date, total study day
    const now = new Date()
    const lastStudyDate = foundUser?.lastStudyDate

    //increase streak value if consecutive
    if (!lastStudyDate || now.getDay() - lastStudyDate.getDay() == 1) {
      ;(foundUser.streak as number) += 1
      foundUser.totalStudyDay = (foundUser.totalStudyDay ?? 0) + 1
    }
    foundUser.lastStudyDate = now

    //save user into db
    const repo = manager?.getRepository(User) ?? userRepository
    return await repo.save(foundUser)
  }
}

export const wordProgressService = new WordProgressService()
