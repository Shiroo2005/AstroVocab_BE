import { Like } from 'typeorm'

export const buildFilterLike = ({ likeFields }: { likeFields: Record<string, string | undefined> }) => {
  const filter = {} as any

  //mapping for like fields
  Object.keys(likeFields).forEach((field) => {
    if (likeFields[field]) {
      filter[field] = Like(`%${likeFields[field]}%`)
    }
  })

  return filter
}
