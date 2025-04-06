import { checkSchema } from 'express-validator'
import { validateSchema } from '~/utils/validate'
import { isString } from '../common.middlewares'
import { isEmpty } from 'lodash'
import { Request } from 'express'

export const findUserValidation = validateSchema(
  checkSchema(
    {
      sort: {
        optional: true,
        ...isString('sort'),
        custom: {
          options: (sort: string, { req }) => {
            const orderStatement: Record<string, 'ASC' | 'DESC'> = {}
            if (sort && !isEmpty(sort)) {
              const sortFields = sort.split(',')
              sortFields.forEach((sortField) => {
                const [fieldSort, orderSort] = sortField.split(':')
                if (fieldSort && orderSort) {
                  // Ensure the sort order is either ASC or DESC
                  orderStatement[fieldSort] = orderSort.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'
                }
              })
              ;(req as Request).sortParsed = orderStatement

              return true
            }
          }
        }
      }
    },
    ['query']
  )
)
