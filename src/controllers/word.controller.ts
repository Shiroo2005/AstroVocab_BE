import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CREATED, SuccessResponse } from '~/core/success.response'
import { CreateWordBodyReq } from '~/dto/req/word/createWordBody.req'
import { UpdateWordBodyReq } from '~/dto/req/word/updateWordBody.req'
import { getOrSetCache } from '~/middlewares/redis/redis.middleware'
import { wordService } from '~/services/word.service'
import { buildCacheKey } from '~/utils/redis'

export const createWordController = async (req: Request<ParamsDictionary, any, CreateWordBodyReq>, res: Response) => {
  return new CREATED({
    message: 'Create word successful!',
    metaData: await wordService.createWords(req.body.words)
  }).send(res)
}

export const updateWordController = async (req: Request<ParamsDictionary, any, UpdateWordBodyReq>, res: Response) => {
  const id = (req as Request).idParams as number

  return new SuccessResponse({
    message: 'Update word by id successful!',
    metaData: await wordService.updateWord(id, req.body)
  }).send(res)
}

export const getWord = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const id = (req as Request).idParams as number

  //build key for redis
  const key = buildCacheKey(req.baseUrl + req.path, {})

  return new SuccessResponse({
    message: 'Get word by id successful!',
    metaData: await getOrSetCache(key, () => wordService.getWordById({ id }))
  }).send(res)
}

export const getAllWords = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  //build key for redis
  const key = buildCacheKey(req.baseUrl + req.path, { ...req.params, ...req.query })

  return new SuccessResponse({
    message: 'Get word by id successful!',
    metaData: await getOrSetCache(key, () =>
      wordService.getAllWords({ ...req.query, ...req.parseQueryPagination, sort: req.sortParsed })
    )
  }).send(res)
}

export const deleteWordById = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const id = (req as Request).idParams as number

  return new SuccessResponse({
    message: 'Delete word by id successful!',
    metaData: await wordService.deleteWordById({ id })
  }).send(res)
}

export const restoreWordById = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const id = (req as Request).idParams as number

  return new SuccessResponse({
    message: 'Restore word by id successful!',
    metaData: await wordService.restoreWordById({ id })
  }).send(res)
}
