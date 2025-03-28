import _, { parseInt } from 'lodash'

export const isValidNumber = (num: string) => !Number.isNaN(parseInt(num))

export const toNumber = (num: string) => _.toNumber(num)

export const getInfoData = ({ fields = [], object = {} }: { fields: Array<string>; object: object }) => {
  return _.pick(object, fields)
}

export const unGetData = ({ fields = [], object = {} }: { fields?: Array<string>; object?: object }) => {
  return _.omit(object, fields)
}

// export const getSelectData = (select = []) => {
//   return Object.fromEntries(select.map((el) => [el, 1]))
// }

// export const unGetSelectData = (select = []) => {
//   return Object.fromEntries(select.map((el) => [el, 0]))
// }
