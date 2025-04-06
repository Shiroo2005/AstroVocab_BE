import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CREATED, SuccessResponse } from '~/core/success.response'
import { CreateWordBodyReq } from '~/dto/req/word/createWordBody.req'
import { UpdateWordBodyReq } from '~/dto/req/word/updateWordBody.req'
import { wordService } from '~/services/word.service'

export const createWordController = async (req: Request<ParamsDictionary, any, CreateWordBodyReq>, res: Response) => {
  return new CREATED({
    message: 'Create word successful!',
    metaData: await wordService.createWord(req.body)
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

  return new SuccessResponse({
    message: 'Get word by id successful!',
    metaData: await wordService.getWordById({ id })
  }).send(res)
}

export const getAllWords = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  return new SuccessResponse({
    message: 'Get word by id successful!',
    metaData: await wordService.getAllWords(req.query)
  }).send(res)
}

export const deleteWordById = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const id = (req as Request).idParams as number

  return new SuccessResponse({
    message: 'Delete word by id successful!',
    metaData: await wordService.deleteWordById({ id })
  }).send(res)
}
