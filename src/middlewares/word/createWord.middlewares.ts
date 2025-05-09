import { checkSchema } from 'express-validator'
import { validateSchema } from '~/utils/validate'
import { isLength, isRequired, isString } from '../common.middlewares'
import { isValidEnumValue } from '~/utils'
import { WordPosition, WordRank } from '~/constants/word'
import { BadRequestError } from '~/core/error.response'

export const createWordValidation = validateSchema(
  checkSchema(
    {
      words: {},
      'words.*.content': {
        trim: true,
        ...isRequired('content'),
        ...isString('content'),
        ...isLength({ fieldName: 'content', min: 1, max: 255 })
      },
      'words.*.pronunciation': {
        trim: true,
        ...isRequired('pronunciation'),
        ...isString('pronunciation'),
        ...isLength({ fieldName: 'pronunciation', min: 1, max: 255 })
      },
      'words.*.position': {
        optional: true,
        custom: {
          options: (value) => {
            if (!isValidEnumValue(value, WordPosition))
              throw new BadRequestError('position must be in enum WORD POSITION!')
            return true
          }
        }
      },
      'words.*.meaning': {
        trim: true,
        ...isRequired('meaning'),
        ...isString('meaning'),
        ...isLength({ fieldName: 'meaning', min: 1, max: 255 })
      },
      'words.*.audio': {
        trim: true,
        optional: true,
        ...isString('audio'),
        ...isLength({ fieldName: 'audio', min: 1, max: 255 })
      },
      'words.*.image': {
        trim: true,
        optional: true,
        ...isString('image'),
        ...isLength({ fieldName: 'image', min: 1, max: 255 })
      },
      'words.*.rank': {
        optional: true,
        custom: {
          options: (value) => {
            if (!isValidEnumValue(value, WordRank)) throw new BadRequestError('rank must be in enum WORD Rank!')
            return true
          }
        }
      },
      'words.*.example': {
        trim: true,
        optional: true,
        ...isString('example'),
        ...isLength({ fieldName: 'example', min: 1, max: 255 })
      },
      'words.*.translateExample': {
        trim: true,
        optional: true,
        ...isString('translate example'),
        ...isLength({ fieldName: 'translate example', min: 1, max: 255 })
      }
    },
    ['body']
  )
)
