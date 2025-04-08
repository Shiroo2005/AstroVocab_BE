import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CREATED, SuccessResponse } from '~/core/success.response'
import { CreateTopicBodyReq } from '~/dto/req/topic/createTopicBody.req'
import { UpdateTopicBodyReq } from '~/dto/req/topic/updateTopicBody.req'
import { topicService } from '~/services/topic.service'

export const createTopicController = async (req: Request<ParamsDictionary, any, CreateTopicBodyReq>, res: Response) => {
  return new CREATED({
    message: 'Create new topic successful!',
    metaData: await topicService.createTopic(req.body)
  }).send(res)
}

export const updateTopicController = async (req: Request<ParamsDictionary, any, UpdateTopicBodyReq>, res: Response) => {
  const topicId = req.idParams as number

  return new SuccessResponse({
    message: 'Update topic by id successful!',
    metaData: await topicService.updateTopic(topicId, req.body)
  }).send(res)
}
