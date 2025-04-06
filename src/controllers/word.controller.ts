import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CREATED } from '~/core/success.response'
import { CreateWordBodyReq } from '~/dto/req/word/createWordBody.req'
import { wordService } from '~/services/word.service'

export const createWordController = async (req: Request<ParamsDictionary, any, CreateWordBodyReq>, res: Response) => {
  return new CREATED({
    message: 'Create word successful!',
    metaData: await wordService.createWord(req.body)
  }).send(res)
}
