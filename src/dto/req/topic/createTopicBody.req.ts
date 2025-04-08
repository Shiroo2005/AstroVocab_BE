import { TopicType } from '~/constants/topic'

export interface CreateTopicBodyReq {
  title: string
  description: string
  thumbnail?: string
  type?: TopicType
  wordIds?: number[]
}
