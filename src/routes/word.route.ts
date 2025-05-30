import express from 'express'
import { Resource } from '~/constants/access'
import {
  createWordController,
  deleteWordById,
  getAllWords,
  getWord,
  restoreWordById,
  updateWordController
} from '~/controllers/word.controller'
import { Word } from '~/entities/word.entity'
import { accessTokenValidation } from '~/middlewares/auth/accessToken.middleware'
import { checkPermission } from '~/middlewares/auth/checkPermission.middleware'
import { verifyAccountValidation } from '~/middlewares/auth/verifyAccount.middleware'
import { checkIdParamMiddleware, checkQueryMiddleware, parseSort } from '~/middlewares/common.middlewares'
import { createWordValidation } from '~/middlewares/word/createWord.middlewares'
import { updateWordValidation } from '~/middlewares/word/updateWord.middlewares'
import { wrapRequestHandler } from '~/utils/handler'
export const wordRouter = express.Router()

// authenticate....
wordRouter.use(accessTokenValidation)

// is account verified
wordRouter.use(verifyAccountValidation)

// GET
/**
 * @description : Get word by id
 * @method : GET
 * @path : /:id
 * @header : Authorization
 */
wordRouter.get('/:id', checkIdParamMiddleware({}), wrapRequestHandler(getWord))

/**
 * @description : Get all word
 * @method : GET
 * @path : /
 * @header : Authorization
 * @query : 
 * { 
 *  page?: number, 
 *  limit?: number
*   content?: string
    pronunciation?: string
    meaning?: string
    position?: WordPosition
    rank?: WordRank
    example?: string
    translateExample?: string
    sort?: FindOptionsOrder<Word>
 * }
 */
wordRouter.get(
  '/',
  checkQueryMiddleware(),
  wrapRequestHandler(parseSort({ allowSortList: Word.allowSortList })),
  wrapRequestHandler(getAllWords)
)

// POST
/**
 * @description : Create new word
 * @method : POST
 * @path : /
 * @header : Authorization
 * @body : {
        content: string
        pronunciation: string
        meaning: string
        position?: WordPosition
        audio?: string
        image?: string
        rank?: WordRank
        example?: string
        translateExample?: string
 * }[]
 */
wordRouter.post(
  '/',
  wrapRequestHandler(checkPermission('createAny', Resource.WORD)),
  createWordValidation,
  wrapRequestHandler(createWordController)
)

/**
 * @description : Restore word from deleted
 * @method : PATCH
 * @path : /:id/restore
 * @header : Authorization
 * @params: id
 */
wordRouter.patch(
  '/:id/restore',
  wrapRequestHandler(checkPermission('updateAny', Resource.WORD)),
  checkIdParamMiddleware(),
  wrapRequestHandler(restoreWordById)
)
// PUT

// PATCH
/**
 * @description : Create new word
 * @method : PATCH
 * @path : /:id
 * @header : Authorization
 * @param: id
 * @body :
        content?: string
        pronunciation?: string
        meaning?: string
        position?: WordPosition
        audio?: string
        image?: string
        rank?: WordRank
        example?: string
        translateExample?: string
 *
 */
wordRouter.patch(
  '/:id',
  wrapRequestHandler(checkPermission('updateAny', Resource.WORD)),
  checkIdParamMiddleware(),
  updateWordValidation,
  wrapRequestHandler(updateWordController)
)

// DELETE
/**
 * @description : Delete word by id
 * @method : DELETE
 * @path : /:id
 * @header : Authorization
 */
wordRouter.delete(
  '/:id',
  wrapRequestHandler(checkPermission('deleteAny', Resource.WORD)),
  checkIdParamMiddleware({}),
  wrapRequestHandler(deleteWordById)
)
