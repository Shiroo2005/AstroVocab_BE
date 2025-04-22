import { Request, Response, NextFunction } from 'express'
import { wordProgressRepository } from '~/repositories/wordProgress.repository'
import { NotFoundRequestError } from '~/core/error.response'
import { UpdateWordProgressData } from '~/dto/req/wordProgress/updateWordProgressBody.req'
import { User } from '~/entities/user.entity'
import { validateSchema } from '~/utils/validate'
import { checkSchema } from 'express-validator'
import { isNumber } from '../common.middlewares'
import { wordService } from '~/services/word.service'

export const updateWordProgressValidation = async (req: Request, res: Response, next: NextFunction) => {
  validateSchema(
    checkSchema({
      wordProgress: {
        isArray: true
      },
      'wordProgress.*.wrongCount': {
        ...isNumber('wrongCount')
      },
      'wordProgress.*.wordId': {
        ...isNumber('wrongCount'),
        custom: {
          options: async (wordId) => {
            if (!Object.keys(wordService.getWordById({ id: wordId })))
              throw new NotFoundRequestError('Word id invalid!')
          }
        }
      }
    })
  )
  const user = req.user as User

  const result: UpdateWordProgressData[] = await Promise.all(
    (req.body.wordProgress as { wordId: number; wrongCount: number; reviewedDate: Date }[]).map(
      async (_wordProgress) => {
        const foundWordProgress = await wordProgressRepository.findOne({
          word: { id: _wordProgress.wordId },
          user: { id: user.id }
        })

        if (!foundWordProgress) throw new NotFoundRequestError('Word id invalid!')

        return {
          reviewedDate: _wordProgress.reviewedDate,
          wrongCount: _wordProgress.wrongCount,
          word: {
            ...foundWordProgress
          }
        }
      }
    )
  )

  req.body.wordProgress = result

  next()
}
