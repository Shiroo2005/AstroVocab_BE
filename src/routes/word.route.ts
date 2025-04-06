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
import { accessTokenValidation } from '~/middlewares/auth/accessToken.middleware'
import { checkPermission } from '~/middlewares/auth/checkPermission.middleware'
import { checkIdParamMiddleware, checkQueryMiddleware } from '~/middlewares/common.middlewares'
import { createWordValidation } from '~/middlewares/word/createWord.middlewares'
import { updateWordValidation } from '~/middlewares/word/updateWord.middlewares'
import { wrapRequestHandler } from '~/utils/handler'
export const wordRouter = express.Router()

// authenticate....
wordRouter.use(accessTokenValidation)

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
 * @query : { page?: number, limit?: number}
 */
wordRouter.get('/', checkQueryMiddleware({ numbericFields: ['page', 'limit'] }), wrapRequestHandler(getAllWords))

// POST
/**
 * @description : Create new word
 * @method : POST
 * @path : /
 * @header : Authorization
 * @body : words: {
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
