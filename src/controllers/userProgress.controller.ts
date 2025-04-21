import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CREATED } from '~/core/success.response'
import { CompleteTopicBodyReq } from '~/dto/req/topic/completeTopicBody.req'
import { User } from '~/entities/user.entity'
import { topicService } from '~/services/topic.service'
export const completeTopicController = async (
  req: Request<ParamsDictionary, any, CompleteTopicBodyReq>,
  res: Response
) => {
  const user = req.user as User
  return new CREATED({
    message: 'Create complete topic successful!',
    metaData: await topicService.completedTopic({ ...req.body, userId: user.id as number })
  }).send(res)
}
