export interface SummaryUserRes {
  totalLearnWord: number
  statistics: {
    level: string
    wordCount: number
  }[]
}
