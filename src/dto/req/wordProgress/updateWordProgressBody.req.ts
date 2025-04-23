import { WordProgress } from '~/entities/wordProgress.entity'

export interface UpdateWordProgressBodyReq {
  wordProgress: UpdateWordProgressData[]
}

export interface UpdateWordProgressData {
  wrongCount?: number
  word: WordProgress
  reviewedDate: Date
}
