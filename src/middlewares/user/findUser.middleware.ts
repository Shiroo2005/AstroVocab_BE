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
            const sortList = ['id', 'username', 'email', 'fullName', 'status']

            //convert sort to sort statement in typeorm
            // sort like sort =-id,+name
            const orderStatement: Record<string, 'ASC' | 'DESC'> = {}
            if (sort && !isEmpty(sort)) {
              const sortFields = sort.split(',')
              sortFields.forEach((sortField) => {
                const orderSort = sortField[0],
                  fieldSort = sortField.substring(1)
                if (fieldSort && orderSort && sortList.includes(fieldSort)) {
                  // Ensure the sort order is either ASC or DESC
                  orderStatement[fieldSort] = orderSort === '-' ? 'DESC' : 'ASC'
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
