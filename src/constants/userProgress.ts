export enum WORD_MASTERY_LEVEL {
  NEW, // easeFactor  = 0
  LEARNING, // easeFactor = 1
  REVIEWING, // easeFactor <= 5
  MASTERED // easeFactor  = 7
}

export const DEFAULT_MASTERY_LEVEL = WORD_MASTERY_LEVEL.NEW
export const INTERVAL_BASE = 1 // space repetition
export const MULTI_BASE = 2
export const DEFAULT_EASE_FACTOR = 0
export const DEFAULT_REVIEW_COUNT = 0
