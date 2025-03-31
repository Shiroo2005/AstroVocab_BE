import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { BadRequestError } from '~/core/error.response'
import { isValidNumber, toNumber } from '~/utils'

export const checkIdParamMiddleware = (options?: { id?: string }) => {
  const id = options?.id || 'id'
  return (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    if (req.params[id] && !isValidNumber(req.params[id])) {
      throw new BadRequestError('Id invalid!')
    }
    ;(req as Request).idParams = toNumber(req.params[id])
    next()
  }
}

export const checkQueryRequiredMiddleware = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const queryKeys = Object.keys(req.query)

    // Kiểm tra xem có query nào không nằm trong fields không
    const invalidFields = fields.filter((field) => !req.query[field])
    console.log(invalidFields, queryKeys, fields, req.query, !req.query['roleId'])

    if (invalidFields.length > 0) {
      throw new BadRequestError(`${fields.join(', ')} is required on query!`)
    }

    next()
  }
}

export const isRequired = (fieldName: string) => ({
  notEmpty: {
    errorMessage: `${fieldName} is required`
  }
})

export const isEmail = {
  isEmail: {
    errorMessage: 'Invalid email format'
  },
  normalizeEmail: true
}

export const isPassword = {
  isStrongPassword: {
    options: {
      minLength: 6,
      minLowercase: 0,
      minNumbers: 0,
      minSymbols: 0,
      minUppercase: 1
    },
    errorMessage: 'Password must be at least 6 characters, 1 upper case'
  }
}

export const isUsername = {
  isLength: {
    options: { min: 6 },
    errorMessage: 'Username must be at least 6 characters'
  },
  matches: {
    options: /^[a-zA-Z0-9]+$/,
    errorMessage: 'Only letters and numbers are allowed'
  }
}

export const isLength = ({ fieldName, min = 6, max = 30 }: { fieldName: string; min?: number; max?: number }) => ({
  isLength: {
    options: {
      min,
      max
    },
    errorMessage: `${fieldName} length must be between ${min} and ${max}`
  }
})

export const isString = (fieldName: string) => {
  return {
    isString: {
      errorMessage: `${fieldName} must be a string!`
    }
  }
}
