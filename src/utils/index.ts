import { error } from 'console'
import _, { toNumber } from 'lodash'

export const isValidNumber = (num: string) => {
  try {
    return toNumber(num)
  } catch (error) {
    return false
  }
}

export const toNumberWithDefaultValue = (num: any, defaultValue: number) => {
  if (!num) return defaultValue
  try {
    const value = toNumber(num)
    if (isNaN(value)) throw new Error('Fail to convert')
  } catch (error) {
    return defaultValue
  }
}

export const getInfoData = ({ fields = [], object = {} }: { fields: Array<string>; object: object }) => {
  return _.pick(object, fields)
}

export const unGetData = ({ fields = [], object = {} }: { fields?: Array<string>; object?: object }) => {
  return _.omit(object, fields)
}

export const unGetDataArray = ({ fields = [], objects = [] }: { fields?: Array<string>; objects?: object[] }) => {
  return objects.map((object) => unGetData({ fields, object }))
}

export const getResourceValues = <T extends object>(enumType: T) => {
  return Object.values(enumType)
}

export const isValidEnumValue = <T extends object>(value: string, enumObj: T): boolean => {
  return Object.values(enumObj).includes(value as T[keyof T])
}

export const objectToArray = <T>(obj: Record<string, T>): T[] => {
  return Object.values(obj)
}

// export const getSelectData = (select = []) => {
//   return Object.fromEntries(select.map((el) => [el, 1]))
// }

// export const unGetSelectData = (select = []) => {
//   return Object.fromEntries(select.map((el) => [el, 0]))
// }
