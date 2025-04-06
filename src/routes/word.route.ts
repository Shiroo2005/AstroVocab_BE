import express from 'express'
import { Resource } from '~/constants/access'
import { createWordController } from '~/controllers/word.controller'
import { accessTokenValidation } from '~/middlewares/auth/accessToken.middleware'
import { checkPermission } from '~/middlewares/auth/checkPermission.middleware'
import { createWordValidation } from '~/middlewares/word/createWord.middlewares'
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

// DELETE
