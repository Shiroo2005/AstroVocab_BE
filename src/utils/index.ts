import { error } from 'console'
import _, { toNumber } from 'lodash'
import { userRepository } from '~/repositories/user.repository'

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
    return value
  } catch (error) {
    return defaultValue
  }
}

export const isArrayEqual = (arr1: number[], arr2: number[]) => {
  return _.isEqual(_.sortBy(arr1), _.sortBy(arr2))
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
  console.log(Object.values(enumObj))

  return Object.values(enumObj).includes(value as T[keyof T])
}

export const objectToArray = <T>(obj: Record<string, T>): T[] => {
  return Object.values(obj)
}

export function getEnumLabels<T extends object>(enumObj: T): (keyof T)[] {
  return Object.keys(enumObj).filter((key) => isNaN(Number(key))) as (keyof T)[]
}

export async function generateUniqueUsername(baseUsername: string): Promise<string> {
  const finalUsername = baseUsername.toLowerCase().replace(/[^a-z0-9]/g, '')
  let counter = 0
  let usernameToCheck = finalUsername

  while (await userRepository.findOne({ username: usernameToCheck })) {
    counter++
    usernameToCheck = `${finalUsername}${counter}`
  }

  return usernameToCheck
}

// export const getSelectData = (select = []) => {
//   return Object.fromEntries(select.map((el) => [el, 1]))
// }

// export const unGetSelectData = (select = []) => {
//   return Object.fromEntries(select.map((el) => [el, 0]))
// }
