import { faker } from '@faker-js/faker'
import { TopicType } from '~/constants/topic'
import { Word } from '~/entities/word.entity'
import { TopicBody } from '~/dto/req/topic/createTopicBody.req'

const TOPIC_COUNT = 50

const randomTopic = (words: Word[]): TopicBody => {
  return {
    title: faker.word.words(2),
    description: faker.lorem.sentence(),
    thumbnail: faker.image.avatar(),
    type: TopicType.FREE,
    wordIds: faker.helpers.arrayElements(words, faker.number.int({ min: 2, max: 4 })).map((item) => item.id)
  } as TopicBody
}

export const topicSeedData = (word: Word[]) => {
  return faker.helpers.multiple(() => randomTopic(word), { count: TOPIC_COUNT })
}
