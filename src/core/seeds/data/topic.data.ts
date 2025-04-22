import { Topic } from '~/entities/topic.entity'
import { faker } from '@faker-js/faker'
import { TopicType } from '~/constants/topic'
import { Word } from '~/entities/word.entity'
import { wordSeedData } from './word.data'

const TOPIC_COUNT = 500

const randomTopic = (words: Word[]): Topic => {
  return {
    title: faker.word.words(2),
    description: faker.lorem.sentence(),
    thumbnail: faker.image.avatar(),
    type: TopicType.FREE,
    words: faker.helpers.arrayElements(words, faker.number.int({ min: 2, max: 4 }))
  } as Topic
}

export const topicSeedData = faker.helpers.multiple(() => randomTopic(wordSeedData), { count: TOPIC_COUNT })
