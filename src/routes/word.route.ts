import express from 'express'
import { Resource } from '~/constants/access'
import { createWordController, updateWordController } from '~/controllers/word.controller'
import { accessTokenValidation } from '~/middlewares/auth/accessToken.middleware'
import { checkPermission } from '~/middlewares/auth/checkPermission.middleware'
import { checkIdParamMiddleware } from '~/middlewares/common.middlewares'
import { createWordValidation } from '~/middlewares/word/createWord.middlewares'
import { updateWordValidation } from '~/middlewares/word/updateWord.middlewares'
import { wrapRequestHandler } from '~/utils/handler'
export const wordRouter = express.Router()

// GET

// authenticate....
wordRouter.use(accessTokenValidation)

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
